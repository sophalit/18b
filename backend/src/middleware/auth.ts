import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
  telegramUser?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  };
}

export const validateTelegramAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('tma ')) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const initData = authHeader.substring(4);
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    if (!hash) {
      return res.status(401).json({ error: 'No hash provided' });
    }

    // Create data-check-string
    const dataCheckArr: string[] = [];
    urlParams.forEach((value, key) => {
      dataCheckArr.push(`${key}=${value}`);
    });
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(config.telegram.botToken)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return res.status(401).json({ error: 'Invalid hash' });
    }

    // Parse user data
    const userJson = urlParams.get('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      req.telegramUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
      };
    }

    next();
  } catch (error) {
    console.error('Auth validation error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const optionalTelegramAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('tma ')) {
      return next();
    }

    validateTelegramAuth(req, res, next);
  } catch (error) {
    next();
  }
};
