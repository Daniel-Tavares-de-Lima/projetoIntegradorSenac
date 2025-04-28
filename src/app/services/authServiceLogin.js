export async function login(email, password) {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('https://pi3p.onrender.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    // Armazena o token no localStorage, caso seja necessário
    localStorage.setItem('token', data.accessToken);

    return data; // Retorna os dados (ex: token, nome, role)
  } catch (error) {
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }

}