"use client";

import Image from "next/image";
import casosStyles from "../styles/Home.module.css";
import Link from "next/link";
import { createCase, updateCase, deleteCase } from "../services/casosService";
import { FaRegUser } from "react-icons/fa6";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
import { useState, useEffect } from "react";
import { getUserInfo } from "../services/infoUserServices"; 

interface Caso {
  id: string;
  title: string;
  description: string;
  classification: string;
  statusCase: string;
  managerId: string;
  solicitante?: string;
  dateOpened: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export default function Casos() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [filteredCasos, setFilteredCasos] = useState<Caso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [userName, setUserName] = useState<string>("Usuário");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classification: "",
    peritoResponsavel: "",
    statusCase: "ANDAMENTO" as "ANDAMENTO" | "FINALIZADO" | "ARQUIVADO",
    solicitante: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [editCaseId, setEditCaseId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Erro desconhecido";
  }

  
  const fetchCasos = async () => {
    try {
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
      const casosArray = Array.isArray(data) ? data : data.cases || [];
      setCasos(casosArray);
      setFilteredCasos(casosArray);
    } catch (error) {
      setError(getErrorMessage(error));
      setCasos([]);
      setFilteredCasos([]);
    }
  };

  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("⚠️ Usuário não autenticado. Faça login novamente.");
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
      setError(getErrorMessage(error));
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCasos(casos);
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = casos.filter(
      (caso) =>
        caso.title.toLowerCase().includes(lowerTerm) ||
        caso.description.toLowerCase().includes(lowerTerm) ||
        (caso.solicitante && caso.solicitante.toLowerCase().includes(lowerTerm))
    );
    setFilteredCasos(filtered);
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

    // Define o nome e o role do usuário
    setUserName(userInfo.name || "Usuário Desconhecido");
    setCurrentUserRole(userInfo.role || "UNKNOWN");

    fetchCasos();
    fetchUsuarios();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.classification || !formData.peritoResponsavel) {
      setError("⚠️ Preencha todos os campos obrigatórios");
      return;
    }
    try {
      if (editCaseId) {
        await updateCase(
          editCaseId,
          formData.title,
          formData.description,
          formData.classification,
          formData.peritoResponsavel,
          formData.statusCase,
          formData.solicitante
        );
        alert("✅ Caso atualizado com sucesso!");
        setEditCaseId(null);
      } else {
        const novoCaso = await createCase(
          formData.title,
          formData.description,
          formData.classification,
          formData.peritoResponsavel,
          formData.solicitante
        );
        setCasos((prev) => [...prev, novoCaso]);
        alert("✅ Caso salvo com sucesso!");
      }
      setFormData({
        title: "",
        description: "",
        classification: "",
        peritoResponsavel: "",
        statusCase: "ANDAMENTO",
        solicitante: "",
      });
      setError(null);
      fetchCasos();
    } catch (err) {
      setError(getErrorMessage(err));
      alert(`❌ Erro: ${err}`);
    }
  };

  const handleEdit = (caso: Caso) => {
    setEditCaseId(caso.id);
    setFormData({
      title: caso.title,
      description: caso.description,
      classification: caso.classification,
      peritoResponsavel: caso.managerId,
      statusCase: caso.statusCase as "ANDAMENTO" | "FINALIZADO" | "ARQUIVADO",
      solicitante: caso.solicitante || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar este caso?")) return;
    try {
      await deleteCase(id);
      alert("✅ Caso desativado com sucesso!");
      fetchCasos();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const getManagerName = (managerId: string) => {
    const user = usuarios.find((u) => u.id === managerId);
    return user ? user.name : "-";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
              <Link href={`/home`} className={casosStyles.titulo}>
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
            placeholder="Pesquisar por caso"
            className={casosStyles.pesquisa}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className={casosStyles.user}>
            <FaRegUser /> {userName}
          </div>
        </header>

        <section className={casosStyles.content}>
          <h1>Casos</h1>
          {error && <p className={casosStyles.error}>{error}</p>}

          <h2>Pesquisar</h2>
          <input
            type="search"
            placeholder="Pesquisar por caso"
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
            <h2>{editCaseId ? "Editar Caso" : "Cadastrar Caso"}</h2>
            <form onSubmit={saveCase} className={casosStyles.cadastroCasos}>
              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Título do Caso* <br />
                    <input
                      type="text"
                      name="title"
                      placeholder="Digite o título do caso"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Descrição* <br />
                    <textarea
                      name="description"
                      placeholder="Descreva os detalhes do caso"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Solicitante da Perícia <br />
                    <input
                      type="text"
                      name="solicitante"
                      placeholder="Nome do solicitante"
                      value={formData.solicitante}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>

              <div className={casosStyles.cadastroDireita}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Tipo de Caso* <br />
                    <select
                      name="classification"
                      value={formData.classification}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="CRIMINAL">Exame Criminal</option>
                      <option value="ACIDENTE">Acidente</option>
                      <option value="IDENTIFICACAO">Identificação</option>
                    </select>
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Perito Responsável* <br />
                    <select
                      name="peritoResponsavel"
                      value={formData.peritoResponsavel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {usuarios
                        .filter((user) => user.role === "PERITO")
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Status* <br />
                    <select
                      name="statusCase"
                      value={formData.statusCase}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="ANDAMENTO">Em andamento</option>
                      <option value="FINALIZADO">Finalizado</option>
                      <option value="ARQUIVADO">Arquivado</option>
                    </select>
                  </label>
                </div>
                <button type="submit" className={casosStyles.botaoSalvar}>
                  {editCaseId ? "Salvar Alterações" : "Salvar"}
                </button>
                {editCaseId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditCaseId(null);
                      setFormData({
                        title: "",
                        description: "",
                        classification: "",
                        peritoResponsavel: "",
                        statusCase: "ANDAMENTO",
                        solicitante: "",
                      });
                      setError(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <h2>Todos os Casos</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Data do Fato</th>
                  <th>Solicitante da Perícia</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Solicitar Exames</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCasos.length > 0 ? (
                  filteredCasos.map((caso) => (
                    <tr key={caso.id}>
                      <td data-label="Código">{caso.id.slice(0, 4)}</td>
                      <td data-label="Título">{caso.title}</td>
                      <td data-label="Descrição">{caso.description}</td>
                      <td data-label="Tipo">{caso.classification}</td>
                      <td data-label="Data do Fato">{new Date(caso.dateOpened).toLocaleString()}</td>
                      <td data-label="Solicitante">{caso.solicitante || '-'}</td>
                      <td data-label="Responsável">{getManagerName(caso.managerId)}</td>
                      <td data-label="Status">
                        <span className={casosStyles[`status${caso.statusCase}`]}>
                          {caso.statusCase}
                        </span>
                      </td>
                      <td data-label="Solicitar Exames">
                        <button className={casosStyles.botaoExame}>Solicitar Exame</button>
                      </td>
                      <td data-label="Ações" className={casosStyles.acoes}>
                        {currentUserRole === "ADMIN" || currentUserRole === "PERITO" ? (
                          <>
                            <button
                              className={casosStyles.acaoBotao}
                              title="Editar"
                              onClick={() => handleEdit(caso)}
                            >
                              ✏️
                            </button>
                            <button
                              className={casosStyles.acaoBotao}
                              title="Excluir"
                              onClick={() => handleDelete(caso.id)}
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
                    <td colSpan={10}>Nenhum caso encontrado</td>
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