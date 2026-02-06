import { pool } from "./db";
import dotenv from "dotenv";

dotenv.config();

const products = [
  { title: "កាហ្វេ Latte", priceCents: 350, imageUrl: "https://placehold.co/200x200?text=Latte" },
  { title: "កាហ្វេ Cappuccino", priceCents: 400, imageUrl: "https://placehold.co/200x200?text=Cappuccino" },
  { title: "តែបៃតង", priceCents: 250, imageUrl: "https://placehold.co/200x200?text=GreenTea" },
  { title: "ទឹកក្រូច", priceCents: 300, imageUrl: "https://placehold.co/200x200?text=OrangeJuice" },
  { title: "នំប៉័ង Croissant", priceCents: 450, imageUrl: "https://placehold.co/200x200?text=Croissant" },
  { title: "Chocolate Cake", priceCents: 550, imageUrl: "https://placehold.co/200x200?text=ChocoCake" },
];

async function seed() {
  console.log("Seeding products...");
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (title, priceCents, imageUrl)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title)`,
      [p.title, p.priceCents, p.imageUrl]
    );
    console.log(`  ✓ ${p.title}`);
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
