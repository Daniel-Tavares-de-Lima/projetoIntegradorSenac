
export async function login(email, password) {
    try {
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
      
      console.log("dados da API: ", data)

      // Armazena o token no localStorage
      localStorage.setItem('token', data.token);
      const nomeUsuario = data?.user?.name || data?.user?.nome || "Usuário";
      localStorage.setItem('userName', nomeUsuario)
  
      return data; // Retorna os dados (ex: token, nome, role)
    } catch (error) {
      throw new Error(error.message || 'Erro ao conectar com o servidor');
    }
  }
  