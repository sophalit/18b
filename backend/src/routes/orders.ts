import { Router, Response } from 'express';
import { OrderModel } from '../models/Order';
import { UserModel } from '../models/User';
import { ProductModel } from '../models/Product';
import { validateTelegramAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user's orders
router.get('/', validateTelegramAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.telegramUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await UserModel.findOrCreate(req.telegramUser);
    const orders = await OrderModel.findByUserId(user.id);
    
    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderModel.getOrderItems(order.id);
        return { ...order, items };
      })
    );
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', validateTelegramAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.telegramUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const id = parseInt(req.params.id, 10);
    const order = await OrderModel.findById(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Verify order belongs to user
    const user = await UserModel.findOrCreate(req.telegramUser);
    if (order.user_id !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const items = await OrderModel.getOrderItems(order.id);
    res.json({ ...order, items });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create new order
router.post('/', validateTelegramAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.telegramUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }
    
    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ${product.name}` 
        });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }
    
    // Create user if not exists
    const user = await UserModel.findOrCreate(req.telegramUser);
    
    // Create order
    const orderId = await OrderModel.create({
      userId: user.id,
      telegramUserId: req.telegramUser.id,
      totalAmount,
      items: orderItems,
    });
    
    const order = await OrderModel.findById(orderId);
    const orderItemsData = await OrderModel.getOrderItems(orderId);
    
    res.status(201).json({ ...order, items: orderItemsData });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (admin endpoint - simplified for MVP)
router.put('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    
    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const success = await OrderModel.updateStatus(id, status);
    
    if (!success) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = await OrderModel.findById(id);
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
