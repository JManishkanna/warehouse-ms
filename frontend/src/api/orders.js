import api from './axios';

export const getOrders = () => api.get('/orders');

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const createOrder = (orderData) => api.post('/orders', orderData);

export const updateOrderStatus = (id, status) => 
  api.patch(`/orders/${id}/status`, null, { params: { status } });

export const deleteOrder = (id) => api.delete(`/orders/${id}`);
