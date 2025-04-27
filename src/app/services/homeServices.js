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
      console.log("Resposta do GET /patients:", data); // Log para depuração
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar pacientes");
      }
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro em fetchPatients:", error.message);
      throw new Error(error.message || "Erro na requisição de pacientes");
    }
}
  

//--Função para pegar todos os casos 
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
      console.log("Resposta do GET /cases:", data); // Log para depuração
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar casos");
      }
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro em fetchCases:", error.message);
      throw new Error(error.message || "Erro na requisição de casos");
    }
}