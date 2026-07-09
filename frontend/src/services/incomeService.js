import api from './api';

export const incomeService = {
  getAll: (page = 1, limit = 10) =>
    api.get('/income/get', { params: { page, limit } }).then(r => r.data),

  add: (data) =>
    api.post('/income/add', data).then(r => r.data),

  update: (id, data) =>
    api.put(`/income/update/${id}`, data).then(r => r.data),

  delete: (id) =>
    api.delete(`/income/delete/${id}`).then(r => r.data),

  getOverview: (range = 'monthly') =>
    api.get('/income/overview', { params: { range } }).then(r => r.data),

  downloadExcel: () =>
    api.get('/income/downloadexcel', { responseType: 'blob' }).then(r => r.data),
};
