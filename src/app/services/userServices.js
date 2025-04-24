
//---Função para criar o usuário
export async function createUser(name, email, password, role) {
    try {
      const token = localStorage.getItem("token");
  
      // Verificar se o token existe
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch("https://pi3p.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar usuário");
      }
  
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}


//--- Função para editar Usuario

export async function updateUser(id, name, email, password, role) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }
    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password) body.password = password;
    if (role) body.role = role;

    const response = await fetch(`https://pi3p.onrender.com/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Erro ao atualizar usuário");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Erro na requisição");
  }
}




//---- Função para excluir usuário

export async function deleteUser(id) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }
    const response = await fetch(`https://pi3p.onrender.com/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Erro ao desativar usuário");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Erro na requisição");
  }
}