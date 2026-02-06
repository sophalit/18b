import { query } from '../config/database';
import { User } from '../types';

export class UserModel {
  static async findByTelegramId(telegramId: number): Promise<User | null> {
    const users = await query<User[]>('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);
    return users[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const users = await query<User[]>('SELECT * FROM users WHERE id = ?', [id]);
    return users[0] || null;
  }

  static async create(user: Partial<User>): Promise<number> {
    const result: any = await query(
      'INSERT INTO users (telegram_id, first_name, last_name, username) VALUES (?, ?, ?, ?)',
      [user.telegram_id, user.first_name, user.last_name, user.username]
    );
    return result.insertId;
  }

  static async findOrCreate(telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  }): Promise<User> {
    let user = await this.findByTelegramId(telegramUser.id);
    
    if (!user) {
      const userId = await this.create({
        telegram_id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
      });
      user = await this.findById(userId);
    }
    
    return user!;
  }
}
