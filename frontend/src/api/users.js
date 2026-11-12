import api from './axios';

export const getUsers = () => api.get('/users');

export const updateUserRole = (id, role) => 
  api.patch(`/users/${id}/role`, null, { params: { role } });

export const toggleUserActive = (id) => 
  api.patch(`/users/${id}/toggle-active`);

export const deleteUser = (id) => 
  api.delete(`/users/${id}`);
