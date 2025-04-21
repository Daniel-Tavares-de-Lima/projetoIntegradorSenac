
export function validarSenhas(senha, confirmarSenha) {
    if (senha !== confirmarSenha) {
      return {
        valido: false,
        mensagem: "As senhas não coincidem. Por favor, verifique."
      };
    }
  
    return {
      valido: true,
      mensagem: "Senhas válidas."
    };
  }