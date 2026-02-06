import { CartItem } from '../types';

const CART_STORAGE_KEY = 'telegram_shop_cart';

export const cartStorage = {
  get: (): CartItem[] => {
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  },

  set: (cart: CartItem[]): void => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  clear: (): void => {
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  add: (item: CartItem): void => {
    const cart = cartStorage.get();
    const existingIndex = cart.findIndex((i) => i.product.id === item.product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    cartStorage.set(cart);
  },

  remove: (productId: number): void => {
    const cart = cartStorage.get();
    const filtered = cart.filter((item) => item.product.id !== productId);
    cartStorage.set(filtered);
  },

  updateQuantity: (productId: number, quantity: number): void => {
    const cart = cartStorage.get();
    const item = cart.find((i) => i.product.id === productId);

    if (item) {
      item.quantity = quantity;
      cartStorage.set(cart);
    }
  },

  getTotal: (): number => {
    const cart = cartStorage.get();
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },

  getItemCount: (): number => {
    const cart = cartStorage.get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
};
