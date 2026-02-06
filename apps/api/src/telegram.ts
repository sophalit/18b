import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

/**
 * Validate Telegram Web App initData using the official HMAC approach.
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateInitData(
  initData: string,
  botToken: string
): TelegramUser | null {
  if (!initData) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  // Remove hash from the params
  params.delete("hash");

  // Sort remaining params alphabetically and join with \n
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  // secretKey = HMAC_SHA256("WebAppData", bot_token)
  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  // computedHash = HMAC_SHA256(dataCheckString, secretKey)
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Compare to hash
  if (computedHash !== hash) return null;

  // Check auth_date freshness (reject if older than 1 hour)
  const authDate = params.get("auth_date");
  if (authDate) {
    const authTimestamp = Number(authDate);
    const now = Math.floor(Date.now() / 1000);
    if (now - authTimestamp > 3600) return null;
  }

  // Parse user from initData
  const userStr = params.get("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as TelegramUser;
  } catch {
    return null;
  }
}
