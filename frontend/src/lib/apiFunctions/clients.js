import axiosBase from '@/lib/axiosBase';

// Создать нового клиента
export const createClient = async (clientData) => {
  try {
    const response = await axiosBase.post('/clients', clientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось создать клиента' };
  }
};

// Получить список клиентов (с пагинацией)
export const getClients = async (skip = 0, limit = 20) => {
  try {
    const response = await axiosBase.get(`/clients?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось получить список клиентов' };
  }
};

// Получить клиента по ID
export const getClientById = async (clientId) => {
  try {
    const response = await axiosBase.get(`/clients/${clientId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Клиент не найден' };
  }
};

// Обновить данные клиента
export const updateClient = async (clientId, clientData) => {
  try {
    const response = await axiosBase.put(`/clients/${clientId}`, clientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось обновить данные клиента' };
  }
};
