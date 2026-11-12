import api from './axios';

export const getWarehouses = () => api.get('/warehouse');

export const createWarehouse = (data) => api.post('/warehouse', data);

export const getWarehouseShelves = (warehouseId) => 
  api.get(`/warehouse/${warehouseId}/shelves`);

export const getAllShelves = () => api.get('/warehouse/shelves');

export const createShelf = (warehouseId, data) => 
  api.post(`/warehouse/${warehouseId}/shelves`, data);

export const getWarehouseMapData = (warehouseId) => 
  api.get(`/warehouse/${warehouseId}/map`);
