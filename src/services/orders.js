import axios from 'axios';
import { decreaseStock } from '../data/Products';

const ORDERS_API_URL = import.meta.env.VITE_ORDERS_API_URL;
const ORDERS_STORAGE_KEY = 'mine_orders';

export async function createOrder(order) {
  if (ORDERS_API_URL) {
    const { data } = await axios.post(ORDERS_API_URL, order);
    return data;
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  const savedOrder = {
    ...order,
    id: `MS-${Date.now().toString(36).toUpperCase()}`,
    status: 'pagada',
    createdAt: new Date().toISOString(),
  };

  decreaseStock(order.items);
  const history = getOrders();
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([savedOrder, ...history]));

  return savedOrder;
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
