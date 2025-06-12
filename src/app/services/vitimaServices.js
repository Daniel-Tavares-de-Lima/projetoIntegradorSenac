export async function createVitima(nic, name, gender, age, document, address, ethnicity, odontogram, anatomicalNotes, caseId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch("https://pi3p.onrender.com/victims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nic,
          name,
          gender,
          age: age ? parseInt(age) : null, // Garante que a idade seja um número
          document,
          address,
          ethnicity,
          odontogram,
          anatomicalNotes,
          caseId,
          status: "ATIVADO", // Status padrão para nova vítima
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar vítima");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}

export async function updateVitima(id, nic, name, gender, age, document, address, ethnicity, odontogram, anatomicalNotes, caseId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const body = {};
      if (nic) body.nic = nic;
      if (name) body.name = name;
      if (gender) body.gender = gender;
      if (age !== undefined) body.age = age ? parseInt(age) : null;
      if (document) body.document = document;
      if (address) body.address = address;
      if (ethnicity) body.ethnicity = ethnicity;
      if (odontogram) body.odontogram = odontogram;
      if (anatomicalNotes) body.anatomicalNotes = anatomicalNotes;
      if (caseId) body.caseId = caseId;

      const response = await fetch(`https://pi3p.onrender.com/victims/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao atualizar vítima");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}

export async function deleteVitima(id) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch(`https://pi3p.onrender.com/victims/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao desativar vítima");
      }
      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}

export async function fetchVitimas() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      const response = await fetch("https://pi3p.onrender.com/victims", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar vítimas");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Erro na requisição");
    }
}

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