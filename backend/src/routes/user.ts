import { Router, Response } from 'express';
import { UserModel } from '../models/User';
import { validateTelegramAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', validateTelegramAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.telegramUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await UserModel.findOrCreate(req.telegramUser);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Validate Telegram user (for testing)
router.post('/validate', validateTelegramAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.telegramUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({ 
      valid: true, 
      user: req.telegramUser 
    });
  } catch (error) {
    console.error('Error validating user:', error);
    res.status(500).json({ error: 'Failed to validate user' });
  }
});

export default router;
