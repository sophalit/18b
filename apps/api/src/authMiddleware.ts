import { Request, Response, NextFunction } from "express";
import { validateInitData, TelegramUser } from "./telegram";

// Extend Express Request to include telegramUser
declare global {
  namespace Express {
    interface Request {
      telegramUser?: TelegramUser;
    }
  }
}

/**
 * Middleware that validates Telegram initData from the x-telegram-init-data header.
 * Sets req.telegramUser if validation succeeds.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const initData = req.headers["x-telegram-init-data"] as string | undefined;
  if (!initData) {
    res.status(401).json({ error: "Missing x-telegram-init-data header" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    res.status(500).json({ error: "Bot token not configured" });
    return;
  }

  const user = validateInitData(initData, botToken);
  if (!user) {
    res.status(401).json({ error: "Invalid or expired initData" });
    return;
  }

  req.telegramUser = user;
  next();
}
