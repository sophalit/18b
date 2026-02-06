import { Bot, Keyboard } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

if (!WEBAPP_URL) {
  throw new Error("WEBAPP_URL is required");
}

const bot = new Bot(BOT_TOKEN);

// /start command — sends WebApp button
bot.command("start", async (ctx) => {
  const keyboard = new Keyboard()
    .webApp("🛒 Open Shop", WEBAPP_URL)
    .resized();

  await ctx.reply(
    "សួស្តី! 👋 សូមស្វាគមន៍មកកាន់ Shop!\n\nចុច button ខាងក្រោមដើម្បីបើក Shop:",
    { reply_markup: keyboard }
  );
});

// Receive web_app_data from Mini App
bot.on("message:web_app_data", async (ctx) => {
  try {
    const data = JSON.parse(ctx.message.web_app_data.data);
    await ctx.reply(
      `✅ Order #${data.orderId} ត្រូវបានបង្កើតរួចរាល់!\n` +
        `សរុប: $${(data.totalCents / 100).toFixed(2)}\n` +
        `ស្ថានភាព: pending`
    );
  } catch (err) {
    console.error("Error processing web_app_data:", err);
    await ctx.reply("❌ មានបញ្ហាក្នុងការដំណើរការ order។ សូមព្យាយាមម្ដងទៀត។");
  }
});

// Handle other messages
bot.on("message:text", async (ctx) => {
  await ctx.reply("សូមចុច /start ដើម្បីបើក Shop! 🛒");
});

// Start bot (polling mode)
bot.start({
  onStart: () => {
    console.log("Bot is running! (polling mode)");
  },
});
