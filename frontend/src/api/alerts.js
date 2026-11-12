import api from './axios';

export const getAlerts = () => api.get('/alerts');

export const getUnreadAlerts = () => api.get('/alerts/unread');

export const getUnreadAlertCount = () => api.get('/alerts/count');

export const markAlertAsRead = (id) => api.patch(`/alerts/${id}/read`);

export const markAllAlertsAsRead = () => api.post('/alerts/read-all');
