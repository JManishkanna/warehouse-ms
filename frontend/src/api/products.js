import api from './axios';

export const getProducts = (search = '') => 
  api.get('/products', { params: search ? { search } : {} });

export const getProductById = (id) => 
  api.get(`/products/${id}`);

export const createProduct = (data) => 
  api.post('/products', data);

export const updateProduct = (id, data) => 
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) => 
  api.delete(`/products/${id}`);

export const getLowStockProducts = () => 
  api.get('/products/low-stock');

export const getProductCategories = () => 
  api.get('/products/categories');

export const getDemandForecast = (id) => 
  api.get(`/products/${id}/forecast`);
