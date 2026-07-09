import api from './api';

export const expenseService = {
  getAll: (page = 1, limit = 10) =>
    api.get('/expense/get', { params: { page, limit } }).then(r => r.data),

  add: (data) =>
    api.post('/expense/add', data).then(r => r.data),

  update: (id, data) =>
    api.put(`/expense/update/${id}`, data).then(r => r.data),

  delete: (id) =>
    api.delete(`/expense/delete/${id}`).then(r => r.data),

  getOverview: (range = 'monthly') =>
    api.get('/expense/overview', { params: { range } }).then(r => r.data),

  downloadExcel: () =>
    api.get('/expense/downloadexcel', { responseType: 'blob' }).then(r => r.data),
};
