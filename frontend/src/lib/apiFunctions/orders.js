import axiosBase from '@/lib/axiosBase';

// Создать новый заказ
export const createOrder = async (orderData) => {
  try {
    const response = await axiosBase.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось создать заказ' };
  }
};

// Получить список заказов (с пагинацией)
export const getOrders = async (skip = 0, limit = 50) => {
  try {
    const response = await axiosBase.get(`/orders?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось получить заказы' };
  }
};

// Получить заказ по ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axiosBase.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось найти заказ' };
  }
};

// Обновить заказ
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axiosBase.put(`/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error("Ошибка обновления заказа:", error);
    throw error;
  }
};