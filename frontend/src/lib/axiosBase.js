import axios from 'axios';

const axiosBase = axios.create({
  baseURL: 'http://100.126.8.66:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosBase;
