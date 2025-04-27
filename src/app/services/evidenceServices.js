//---Função para pegar todas as evidencias
export async function fetchEvidences() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch("https://pi3p.onrender.com/evidences", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar evidências");
      }

      return data;

    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}
  

//---Função para criar as evidencias
export async function createEvidence(type,dateCollection,caseId,imageURL,content) {

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const body = {
        type,
        dateCollection,
        caseId,
        status: "ATIVADO",
      };

      if (type === "IMAGE" && imageURL) body.imageURL = imageURL;
      if (type === "TEXT" && content) body.content = content;
  
      const response = await fetch("https://pi3p.onrender.com/evidences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar evidência");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}
  

//--Função para editar evidencias
export async function updateEvidence(id,type,dateCollection,caseId,imageURL,content) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const body = {};
      if (type) body.type = type;
      if (dateCollection) body.dateCollection = dateCollection;
      if (caseId) body.caseId = caseId;
      if (imageURL !== undefined) body.imageURL = imageURL;
      if (content !== undefined) body.content = content;
  
      const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const 
      data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar evidência");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}
  
//--Função para excluir evidencias
export async function deleteEvidence(id) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch(`https://pi3p.onrender.com/evidences/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao desativar evidência");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
  }
  
//--Função para pegar os casso
export async function fetchCases() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }
      const response = await fetch("https://pi3p.onrender.com/cases", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar casos");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}