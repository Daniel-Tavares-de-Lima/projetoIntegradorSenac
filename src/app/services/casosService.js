
//--Função para salvar casos
export async function createCase(title, description, classification, managerId, solicitante, dateFact, statusCase) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }

    // Validar statusCase
    if (statusCase && !["ANDAMENTO", "FINALIZADO", "ARQUIVADO"].includes(statusCase)) {
      throw new Error("O status do caso deve ser ANDAMENTO, FINALIZADO ou ARQUIVADO.");
    }

    const response = await fetch("https://pi3p.onrender.com/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        classification,
        managerId,
        statusCase: statusCase || undefined, // Enviar undefined se statusCase for vazio
        status: "ATIVADO",
        solicitante,
        dateFact
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao criar caso");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Erro na requisição");
  }
}

//--Função para editar casos
export async function updateCase(id, title, description, classification, managerId, statusCase, solicitante, dateFact) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }
    const body = {};
    if (title) body.title = title;
    if (description) body.description = description;
    if (classification) body.classification = classification;
    if (managerId) body.managerId = managerId;
    if (statusCase) body.statusCase = statusCase;
    if (solicitante) body.solicitante = solicitante;
    if(dateFact) body.dateFact = dateFact;

    const response = await fetch(`https://pi3p.onrender.com/cases/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Erro ao atualizar caso");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Erro na requisição");
  }}


//--Função para excluir casos
export async function deleteCase(id) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado. Faça login novamente.");
    }
    const response = await fetch(`https://pi3p.onrender.com/cases/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Erro ao desativar caso");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Erro na requisição");
  }
}


export const fetchCases = async () => {
  const response = await fetch("https://pi3p.onrender.com/cases", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao buscar casos");
  }
  return data;
};