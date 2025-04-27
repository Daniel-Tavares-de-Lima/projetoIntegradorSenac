import jwtDecode from 'jwt-decode';

export function getUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      name: decoded.name,
      role: decoded.role,
      email: decoded.email,
      userId: decoded.userId,
    };
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}
