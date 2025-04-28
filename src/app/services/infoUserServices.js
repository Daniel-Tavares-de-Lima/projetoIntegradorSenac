
export function getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        name: payload.name,
        role: payload.role,
        email: payload.email,
        userId: payload.userId,
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }