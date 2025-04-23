// src/services/apiService.js

const API_URL = 'https://pi3p.onrender.com';

export async function apiRequest(endpoint, method = 'POST', body = null, requiresAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization:`Bearer ${token}`
  };

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Usuário não autenticado.');
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao conectar.');
  }

  return data;
}
