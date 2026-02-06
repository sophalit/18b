import { query, getPool } from '../config/database';
import { Order, OrderItem } from '../types';

export class OrderModel {
  static async findByUserId(userId: number): Promise<Order[]> {
    return await query<Order[]>(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  static async findById(id: number): Promise<Order | null> {
    const orders = await query<Order[]>('SELECT * FROM orders WHERE id = ?', [id]);
    return orders[0] || null;
  }

  static async create(order: {
    userId: number;
    telegramUserId: number;
    totalAmount: number;
    items: Array<{ productId: number; quantity: number; price: number }>;
  }): Promise<number> {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Create order
      const [orderResult]: any = await connection.execute(
        'INSERT INTO orders (user_id, telegram_user_id, total_amount, status) VALUES (?, ?, ?, ?)',
        [order.userId, order.telegramUserId, order.totalAmount, 'pending']
      );

      const orderId = orderResult.insertId;

      // Create order items
      for (const item of order.items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );

        // Update product stock
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await query<OrderItem[]>(
      `SELECT oi.*, p.name as product_name, p.image_url as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
  }

  static async updateStatus(id: number, status: string): Promise<boolean> {
    const result: any = await query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }
}
