import { query } from '../config/database';
import { Product } from '../types';

export class ProductModel {
  static async findAll(): Promise<Product[]> {
    return await query<Product[]>('SELECT * FROM products ORDER BY created_at DESC');
  }

  static async findById(id: number): Promise<Product | null> {
    const products = await query<Product[]>('SELECT * FROM products WHERE id = ?', [id]);
    return products[0] || null;
  }

  static async create(product: Partial<Product>): Promise<number> {
    const result: any = await query(
      'INSERT INTO products (name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
      [product.name, product.description, product.price, product.image_url, product.stock]
    );
    return result.insertId;
  }

  static async update(id: number, product: Partial<Product>): Promise<boolean> {
    const result: any = await query(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock = ? WHERE id = ?',
      [product.name, product.description, product.price, product.image_url, product.stock, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const result: any = await query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateStock(id: number, quantity: number): Promise<boolean> {
    const result: any = await query(
      'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
      [quantity, id, quantity]
    );
    return result.affectedRows > 0;
  }
}
