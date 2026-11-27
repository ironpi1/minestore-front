import axios from 'axios';

const ORDERS_API_URL = import.meta.env.VITE_ORDERS_API_URL;
const ORDERS_STORAGE_KEY = 'mine_orders';
export const ORDERS_UPDATED_EVENT = 'mine-orders-updated';

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

  const history = getOrders();
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([savedOrder, ...history]));
  window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));

  return savedOrder;
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function getBestSellingProducts(products, limit = 3) {
  const soldByProduct = new Map();

  getOrders().forEach((order) => {
    if (!Array.isArray(order.items)) return;

    order.items.forEach((item) => {
      const productId = Number(item.productId);
      const quantity = Number(item.cantidad);
      if (!Number.isInteger(productId) || !Number.isFinite(quantity) || quantity <= 0) return;

      soldByProduct.set(
        productId,
        (soldByProduct.get(productId) || 0) + quantity
      );
    });
  });

  const productsById = new Map(products.map((product) => [Number(product.id), product]));

  return [...soldByProduct.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .flatMap(([productId, unitsSold]) => {
      const product = productsById.get(productId);
      return product ? [{ ...product, unitsSold }] : [];
    });
}
