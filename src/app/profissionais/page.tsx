"use client";

import Image from "next/image";
import casosStyles from "../styles/Home.module.css";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
import { useEffect, useState } from "react";
import { createUser, updateUser, deleteUser } from "../services/userServices";
import { getUserInfo } from "../services/infoUserServices"; 

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export default function Profissionais() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [password, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("Usuário");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Buscar usuários
  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("⚠️ Usuário não autenticado. Faça login novamente.");
      window.location.href = "/login";
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
      console.log("Resposta da API /users:", data);
      if (!response.ok) {
        if (response.status === 401) {
          setError("⚠️ Sessão expirada. Faça login novamente.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        if (response.status === 403) {
          setUsuarios([]); // Corrige: não usa "data" aqui, pois data contém apenas a mensagem de erro
          setFilteredUsuarios([]);
          setError("⚠️ Você não tem permissão para visualizar a lista de profissionais devido a restrições do servidor. Entre em contato com um administrador.");
          return;
        }
        throw new Error(data.message || "Erro ao buscar usuários");
      }
      setUsuarios(data);
      setFilteredUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error.message);
      setError(`⚠️ ${error.message}`);
    }
  };

  // Função de pesquisa
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsuarios(usuarios);
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = usuarios.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm)
    );
    setFilteredUsuarios(filtered);
  };

  useEffect(() => {
    // Obtém as informações do usuário usando getUserInfo
    const userInfo = getUserInfo();
    console.log("Informações do usuário:", userInfo);
    if (!userInfo) {
      setError("⚠️ Não foi possível obter informações do usuário. Faça login novamente.");
      window.location.href = "/login";
      return;
    }

    // Define o role e o name do usuário
    setCurrentUserRole(userInfo.role || "UNKNOWN");
    setCurrentUserName(userInfo.name || "Usuário Desconhecido");

    fetchUsuarios();
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
        await updateUser(editUserId, name, email, password || undefined, role);
        alert("✅ Usuário atualizado com sucesso!");
        setEditUserId(null);
      } else {
        if (!password) {
          setError("⚠️ A senha é obrigatória para novos usuários");
          return;
        }
        await createUser(name, email, password, role);
        alert("✅ Usuário salvo com sucesso!");
      }
      setName("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setRole("ADMIN");
      setError(null);
      fetchUsuarios();
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
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await deleteUser(id);
      alert("✅ Usuário desativado com sucesso!");
      fetchUsuarios();
    } catch (error) {
      setError(`❌ Erro: ${error.message}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  console.log("currentUserRole:", currentUserRole);
  console.log("currentUserName:", currentUserName);

  return (
    <div className={casosStyles.container}>
      <button className={casosStyles.hamburger} onClick={toggleSidebar}>
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside className={`${casosStyles.sidebar} ${isSidebarOpen ? casosStyles.open : ""}`}>
        <div>
          <div className={casosStyles.logo}>
            <Image
              src={`/imagens/Logo - Laudo.png`}
              alt="Logo - Laudo"
              width={60}
              height={60}
            />
            <h1>
              <Link href={`http://localhost:3000/home`} className={casosStyles.titulo}>
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
            placeholder="Pesquisar por usuário"
            className={casosStyles.pesquisa}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className={casosStyles.user}>
            <FaRegUser /> {currentUserName}
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
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className={casosStyles.conteudo}>
            <button
              className={casosStyles.botaoPesquisar}
              onClick={() => handleSearch(searchTerm)}
            >
              🔍 Pesquisar
            </button>
          </div>

          <div className={casosStyles.section}>
            {currentUserRole === "ADMIN" && (
              <>
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
              </>
            )}

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
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
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
                          <span>Sem permissões</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Nenhum usuário encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}