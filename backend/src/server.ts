import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { errorHandler } from './middleware/error';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import userRouter from './routes/user';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/user', userRouter);

// Serve static files in production
if (config.nodeEnv === 'production') {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
    🚀 Server is running!
    🔉 Listening on port ${PORT}
    📭 Environment: ${config.nodeEnv}
    🌐 CORS enabled for: ${config.cors.allowedOrigins.join(', ')}
  `);
});

export default app;
