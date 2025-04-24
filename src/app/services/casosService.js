export async function createCase(title, description, classification, managerId) {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
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
          statusCase: "ANDAMENTO",
          status: "ATIVADO",
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



//   // src/services/saveServices.ts
// // export async function createUser(name, email, password, role) {
// //     try {
// //       const token = localStorage.getItem("token");
  
// //       // Verificar se o token existe
// //       if (!token) {
// //         throw new Error("Usuário não autenticado. Faça login novamente.");
// //       }

// //       const response = await fetch("https://pi3p.onrender.com/users", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({ name, email, password, role }),
// //       });
  
// //       const data = await response.json();
      
// //       if (!response.ok) {
// //         throw new Error(data.message || "Erro ao criar usuário");
// //       }
  
// //       return data;
// //     } catch (error) {
// //       throw new Error(error.message || "Erro na requisição");
// //     }
// //   }