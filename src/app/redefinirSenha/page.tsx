"use client";
import { useState } from "react";
import redefinirSenha from "../styles/redefinirSenha.module.css";

export default function RecuperaSenha(){

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setErro("");
    alert("Senha redefinida com sucesso!");
    // Aqui você pode chamar a API para atualizar a senha no banco
  };

    return (
        <div className={redefinirSenha.container}>
          <h1>Redefinir Senha</h1>
          <form onSubmit={handleSubmit} className={redefinirSenha.form}>
            <label>
              Nova Senha:
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </label>
    
            <label>
              Confirmar Nova Senha:
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </label>
    
            {erro && <p className={redefinirSenha.erro}>{erro}</p>}
    
            <button type="submit">Redefinir</button>
          </form>
        </div>
      );
}