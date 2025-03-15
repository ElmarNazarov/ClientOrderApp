import axiosBase from '@/lib/axiosBase';

// Вход в систему
export const loginUser = async (credentials) => {
  try {
    const response = await axiosBase.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Ошибка входа' };
  }
};

// Регистрация пользователя
export const registerUser = async (userData) => {
  try {
    const response = await axiosBase.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось выполнить регистрацию' };
  }
};

// Получить всех пользователей
export const getUsers = async () => {
  try {
    const response = await axiosBase.get('/auth/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Не удалось найти пользователей' };
  }
};

// Получить информацию о пользователе спомощью токена
export const getUserInfo = async (token) => {
  try {
    const response = await axiosBase.get('/auth/if_user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Не удалось получить информацию о пользователе:", error);
    throw error.response?.data || { message: 'Не удалось получить информацию о пользователе' };
  }
};

