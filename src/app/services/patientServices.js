//Função para criar pacients
export async function createPatient(name,sex,birthDate,caseId,identified) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }


      const response = await fetch("https://pi3p.onrender.com/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          sex,
          birthDate: birthDate ? new Date(birthDate).toISOString() : null,
          caseId,
          identified: identified === "YES" ? "YES" : "NO",
          status: "ATIVADO",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar paciente");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}


//--Função para editar pacientes
export async function updatePatient(id,name,sex,birthDate,caseId,identified) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const body = {};
      if (name) body.name = name;
      if (sex) body.sex = sex;
      if (birthDate !== undefined) body.birthDate = birthDate ? new Date(birthDate).toISOString() : null;
      if (caseId) body.caseId = caseId;
      if (identified) body.identified = identified === "YES" ? "YES" : "NO";
  
      const response = await fetch(`https://pi3p.onrender.com/patients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar paciente");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}

//--Função para excluir pacientes
export async function deletePatient(id) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch(`https://pi3p.onrender.com/patients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao desativar paciente");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}


//--Função para pegar todos os pacientes
export async function fetchPatients() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch("https://pi3p.onrender.com/patients", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar pacientes");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}

//--Função para pegar os casos
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

