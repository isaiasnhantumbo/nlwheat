import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.43.138:4000',
});
