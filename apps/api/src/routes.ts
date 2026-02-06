import { Router, Request, Response } from "express";
import { pool } from "./db";
import { authMiddleware } from "./authMiddleware";
import { z } from "zod";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const router = Router();

// GET /health
router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// GET /products — list active products (no auth required)
router.get("/products", async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, title, priceCents, imageUrl FROM products WHERE active = TRUE"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /me — upsert user by telegramId (auth required)
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = req.telegramUser!;
    await pool.query(
      `INSERT INTO users (telegramId, firstName, username)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE firstName = VALUES(firstName), username = VALUES(username)`,
      [user.id, user.first_name, user.username || null]
    );
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE telegramId = ?",
      [user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Error upserting user:", err);
    res.status(500).json({ error: "Failed to get/create user" });
  }
});

// POST /orders — create order (auth required)
const OrderItemSchema = z.object({
  productId: z.number().int().positive(),
  qty: z.number().int().positive(),
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
});

router.post("/orders", authMiddleware, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error("Order validation error:", parsed.error.issues);
      res.status(400).json({ error: "Invalid order data" });
      return;
    }

    const { items } = parsed.data;
    const user = req.telegramUser!;

    // Upsert user
    await pool.query(
      `INSERT INTO users (telegramId, firstName, username)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE firstName = VALUES(firstName), username = VALUES(username)`,
      [user.id, user.first_name, user.username || null]
    );

    // Get user id
    const [userRows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE telegramId = ?",
      [user.id]
    );
    const userId = userRows[0].id;

    // Fetch product prices
    const productIds = items.map((i) => i.productId);
    const [productRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, priceCents FROM products WHERE id IN (?) AND active = TRUE`,
      [productIds]
    );

    const priceMap = new Map<number, number>();
    for (const row of productRows) {
      priceMap.set(row.id, row.priceCents);
    }

    // Verify all products exist
    for (const item of items) {
      if (!priceMap.has(item.productId)) {
        res.status(400).json({ error: `Product ${item.productId} not found or inactive` });
        return;
      }
    }

    // Calculate total
    let totalCents = 0;
    for (const item of items) {
      totalCents += priceMap.get(item.productId)! * item.qty;
    }

    // Create order
    const [orderResult] = await pool.query<ResultSetHeader>(
      "INSERT INTO orders (userId, totalCents, status) VALUES (?, ?, ?)",
      [userId, totalCents, "pending"]
    );
    const orderId = orderResult.insertId;

    // Create order items
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (orderId, productId, qty, unitCents) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.qty, priceMap.get(item.productId)!]
      );
    }

    res.status(201).json({
      id: orderId,
      userId,
      totalCents,
      status: "pending",
      items: items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        unitCents: priceMap.get(i.productId)!,
      })),
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
