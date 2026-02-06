import WebApp from '@twa-dev/sdk';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeader = (): string => {
  if (WebApp.initData) {
    return `tma ${WebApp.initData}`;
  }
  return '';
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const authHeader = getAuthHeader();
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

export const api = {
  // Products
  getProducts: () => fetchWithAuth('/products'),
  getProduct: (id: number) => fetchWithAuth(`/products/${id}`),

  // Orders
  getOrders: () => fetchWithAuth('/orders'),
  getOrder: (id: number) => fetchWithAuth(`/orders/${id}`),
  createOrder: (items: Array<{ productId: number; quantity: number }>) =>
    fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),

  // User
  getUserProfile: () => fetchWithAuth('/user/profile'),
  validateUser: () => fetchWithAuth('/user/validate', { method: 'POST' }),
};
