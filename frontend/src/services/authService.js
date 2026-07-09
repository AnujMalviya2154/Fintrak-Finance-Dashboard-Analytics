import api from './api';

export const authService = {
  login: (email, password) =>
    api.post('/user/login', { email, password }).then(r => r.data),

  register: (name, email, password) =>
    api.post('/user/register', { name, email, password }).then(r => r.data),

  getMe: () =>
    api.get('/user/me').then(r => r.data),

  updateProfile: (name, email) =>
    api.put('/user/profile', { name, email }).then(r => r.data),

  changePassword: (currentPassword, newPassword) =>
    api.put('/user/password', { currentPassword, newPassword }).then(r => r.data),
};
