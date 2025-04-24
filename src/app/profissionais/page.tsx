"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import casosStyles from "../styles/Home.module.css";
import profissionaisStyles from "../styles/Profissionais.module.css";
import Link from "next/link";
{
  /*-----Icones Side bar-----*/
}
import { FaRegUser } from "react-icons/fa6";
import { LuFileUser } from "react-icons/lu";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
{
  /*-----Icones Side bar-----*/
}
import { useEffect, useState } from "react";
// import { validarSenhas } from "../services/validacaoServices";
import { createUser, updateUser, deleteUser} from "../services/userServices";

// import {useState} from "react";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export default function Profissionais() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [password, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [editUserId, setEditUserId] = useState<string | null>(null); // Estado para usuário em edição
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // Papel do usuário logado

  // Buscar usuários
  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }
    try {
      const response = await fetch("https://pi3p.onrender.com/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar usuários");
      }
      setUsuarios(data);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  // Buscar informações do usuário logado (para verificar se é ADMIN)
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("https://pi3p.onrender.com/users/me", { // Assumindo que existe um endpoint /users/me
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUserRole(data.role);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário logado:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchCurrentUser();
  }, []);

  // Criar ou atualizar usuário
  const saveUser = async () => {
    if (!name || !email || !role) {
      setError("⚠️ Preencha todos os campos obrigatórios");
      return;
    }
    if (password !== confirmarSenha) {
      setError("⚠️ As senhas não coincidem");
      return;
    }

    try {
      if (editUserId) {
        // Modo de edição
        await updateUser(editUserId, name, email, password || undefined, role);
        alert("✅ Usuário atualizado com sucesso!");
        setEditUserId(null);
      } else {
        // Modo de criação
        if (!password) {
          setError("⚠️ A senha é obrigatória para novos usuários");
          return;
        }
        await createUser(name, email, password, role);
        alert("✅ Usuário salvo com sucesso!");
      }
      // Limpar formulário
      setName("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setRole("ADMIN");
      setError(null);
      fetchUsuarios(); // Atualizar lista
    } catch (error) {
      setError(`❌ Erro: ${error.message}`);
    }
  };

  // Preencher formulário para edição
  const handleEdit = (user: User) => {
    setEditUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setSenha("");
    setConfirmarSenha("");
  };

  // Excluir usuário
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar este usuário?")) return;
    try {
      await deleteUser(id);
      alert("✅ Usuário desativado com sucesso!");
      fetchUsuarios(); // Atualizar lista
    } catch (error) {
      setError(`❌ Erro: ${error.message}`);
    }
  };

  return (
    <div className={casosStyles.container}>
      <aside className={casosStyles.sidebar}>
        <div>
          <div className={casosStyles.logo}>
            <Image
              src={`/imagens/Logo - Laudo.png`}
              alt="Logo - Laudo"
              width={60}
              height={60}
            />
            <h1>
              <Link href={`http://localhost:3000`} className={casosStyles.titulo}>
                Laudos Periciais Odonto-Legal
              </Link>
            </h1>
          </div>
          <nav className={casosStyles.navi}>
            <div className={casosStyles.icone}>
              <FaRegUser className={casosStyles.iconeInterno} />
              <Link href={`/pacientes`} className={casosStyles.link}>Pacientes</Link>
            </div>
            <div className={casosStyles.icone}>
              <LuFileUser className={casosStyles.iconeInterno} />
              <Link href={`/cadastros`} className={casosStyles.link}>Cadastros</Link>
            </div>
            <div className={casosStyles.icone}>
              <SiElectronbuilder className={casosStyles.iconeInterno} />
              <Link href={`/profissionais`} className={casosStyles.link}>Profissionais</Link>
            </div>
            <div className={casosStyles.icone}>
              <BiSolidUserBadge className={casosStyles.iconeInterno} />
              <Link href={`/casos`} className={casosStyles.link}>Casos</Link>
            </div>
            <div className={casosStyles.icone}>
              <TbFileSearch className={casosStyles.iconeInterno} />
              <Link href={`/evidencias`} className={casosStyles.link}>Evidências</Link>
            </div>
          </nav>
        </div>
        <div className={casosStyles.config}>⚙️ Configurações</div>
      </aside>

      <main className={casosStyles.main}>
        <header className={casosStyles.header}>
          <div className={casosStyles.logoApp}>
            Gest<span>Odo</span>
          </div>
          <input
            type="search"
            placeholder="Pesquisar casos ou pacientes"
            className={casosStyles.pesquisa}
          />
          <div className={casosStyles.user}>
            <FaRegUser /> Julia
          </div>
        </header>

        <section className={casosStyles.content}>
          <h1>Profissionais</h1>
          {error && <p className={casosStyles.error}>{error}</p>}

          <h2>Pesquisar</h2>
          <input
            type="search"
            placeholder="Pesquisar por usuário"
            className={casosStyles.pesquisa}
          />
          <div className={casosStyles.conteudo}>
            <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
          </div>

          <div className={casosStyles.section}>
            <h2>{editUserId ? "Editar Profissional" : "Cadastrar Profissional"}</h2>
            <div className={casosStyles.cadastroCasos}>
              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Nome Completo* <br />
                    <input
                      type="text"
                      placeholder="Digite o nome completo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    E-mail* <br />
                    <input
                      type="email"
                      value={email}
                      placeholder="Digite o email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Senha{editUserId ? " (opcional)" : "*"} <br />
                    <input
                      type="password"
                      placeholder="Digite a senha"
                      value={password}
                      onChange={(e) => setSenha(e.target.value)}
                      required={!editUserId}
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Repita a Senha{editUserId ? " (opcional)" : "*"} <br />
                    <input
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required={!editUserId}
                    />
                  </label>
                </div>
              </div>
              <div className={casosStyles.cadastroDireita}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Perfil de acesso* <br />
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                      <option value="ADMIN">ADMIN</option>
                      <option value="PERITO">PERITO</option>
                      <option value="ASSISTENTE">ASSISTENTE</option>
                    </select>
                  </label>
                </div>
                <button onClick={saveUser}>{editUserId ? "Salvar Alterações" : "Salvar"}</button>
                {editUserId && (
                  <button
                    onClick={() => {
                      setEditUserId(null);
                      setName("");
                      setEmail("");
                      setSenha("");
                      setConfirmarSenha("");
                      setRole("ADMIN");
                      setError(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <h2>Todos os Profissionais</h2>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Nível de Acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.name}</td>
                    <td>{usuario.role}</td>
                    <td className={casosStyles.acoes}>
                      {currentUserRole === "ADMIN" ? (
                        <>
                          <button
                            className={casosStyles.acaoBotao}
                            title="Editar"
                            onClick={() => handleEdit(usuario)}
                          >
                            ✏️
                          </button>
                          <button
                            className={casosStyles.acaoBotao}
                            title="Excluir"
                            onClick={() => handleDelete(usuario.id)}
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <span>
                           <>
                          <button
                            className={casosStyles.acaoBotao}
                            title="Editar"
                            onClick={() => handleEdit(usuario)}
                          >
                            ✏️
                          </button>
                          <button
                            className={casosStyles.acaoBotao}
                            title="Excluir"
                            onClick={() => handleDelete(usuario.id)}
                          >
                            ❌
                          </button>
                        </>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}