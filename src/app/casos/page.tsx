"use client";

import Image from "next/image";
import casosStyles from "../styles/Home.module.css";
import Link from "next/link";
import { createCase, updateCase, deleteCase } from "../services/casosService";
import { FaRegUser, FaChartBar } from "react-icons/fa6";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
import { useState, useEffect } from "react";
import { getUserInfo } from "../services/infoUserServices";
import {generateReport} from "../services/serverServicesIA";
import ReactMarkdown from "react-markdown";

interface Caso {
  id: string;
  title: string;
  description: string;
  classification: string;
  statusCase: string;
  managerId: string;
  solicitante?: string;
  dateOpened: string;
  dateFact: string;
  victims: string[];
  content?: string;
  fileName?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  gender?: string;
}

export default function Casos() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [filteredCasos, setFilteredCasos] = useState<Caso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [victims, setVictims] = useState<User[]>([]);
  const [userName, setUserName] = useState<string>("Usuário");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classification: "",
    peritoResponsavel: "",
    statusCase: "" as "" | "ANDAMENTO" | "FINALIZADO" | "ARQUIVADO",
    solicitante: "",
    dateFact: "",
    victims: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [editCaseId, setEditCaseId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Caso | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  type Report = {
  id: string;
  title: string;
  content: string;
  createdAt: Date; 
};

type Exam = {
  exam: string;
  date: string;
};

  const [reports, setReports] = useState<Report[]>([]);


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

  const fetchVictims = async () => {
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
      setVictims(data);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const fetchReports = async (caseId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");
      const response = await fetch("https://pi3p.onrender.com/reports", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao buscar relatórios");
      const caseReports = Array.isArray(data)
        ? data.filter((report) => report.caseId === caseId)
        : [];
      setReports(caseReports);
      console.log("Relatórios encontrados:", caseReports);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", getErrorMessage(error));
      setReports([]);
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
        (caso.solicitante && caso.solicitante.toLowerCase().includes(lowerTerm)) ||
        caso.victims?.some((victimId) => {
          const victim = victims.find((v) => v.id === victimId);
          return victim && victim.name.toLowerCase().includes(lowerTerm);
        })
    );
    setFilteredCasos(filtered);
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      setError("⚠️ Não foi possível obter informações do usuário. Faça login novamente.");
      window.location.href = "/login";
      return;
    }
    setUserName(userInfo.name || "Usuário Desconhecido");
    setCurrentUserRole(userInfo.role || "UNKNOWN");
    fetchCasos();
    fetchUsuarios();
    fetchVictims();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVictimChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVictims = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, victims: selectedVictims }));
  };

  const saveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.classification ||
      !formData.peritoResponsavel ||
      !formData.dateFact ||
      formData.victims.length === 0
    ) {
      setError(
        "⚠️ Preencha todos os campos obrigatórios: título, descrição, tipo, perito responsável, data do fato e pelo menos uma vítima"
      );
      return;
    }
    if (!["ANDAMENTO", "FINALIZADO", "ARQUIVADO"].includes(formData.statusCase)) {
      setError("⚠️ Selecione um status válido: Em andamento, Finalizado ou Arquivado");
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
          formData.solicitante,
          formData.dateFact,
          formData.victims
        );
        alert("✅ Caso atualizado com sucesso!");
        setEditCaseId(null);
      } else {
        const novoCaso = await createCase(
          formData.title,
          formData.description,
          formData.classification,
          formData.peritoResponsavel,
          formData.solicitante,
          formData.dateFact,
          formData.statusCase,
          formData.victims
        );
        setCasos((prev) => [...prev, novoCaso]);
        alert("✅ Caso salvo com sucesso!");
      }
      setFormData({
          title: "",
          description: "",
          classification: "",
          peritoResponsavel: "",
          statusCase: "",
          solicitante: "",
          dateFact: "",
          victims: [],
        });
      setError(null);
      fetchCasos();
    } catch (error) {
      setError(getErrorMessage(error));
      alert(`❌ Erro: ${getErrorMessage(error)}`);
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
      dateFact: caso.dateFact || "",
      victims: caso.victims || [],
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
      alert(`❌ Erro: ${getErrorMessage(error)}`);
    }
  };

  const handleViewCase = async (caso: Caso) => {
    setSelectedCase(caso);
    setModalVisible(true);
    await fetchReports(caso.id);
  };

  const handleGenerateReport = async () => {
    if (!selectedCase) return;
    setIsGeneratingReport(true);
    setReportError(null);
    try {
      const victimDetails = victims.filter((v) =>
        selectedCase.victims?.includes(v.id)
      );
      const report = await generateReport(selectedCase, victimDetails, usuarios.filter((u) => u.role === "PERITO"));
      setReportTitle(report.title);
      setReportContent(report.content);
      setReportModalVisible(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setReportError(errorMessage);
      alert(`❌ Erro: ${errorMessage}`);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleSaveReport = async () => {
    if (!selectedCase || !reportTitle || !reportContent) {
      alert("❌ Título ou conteúdo do relatório inválido.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado.");
      const response = await fetch("https://pi3p.onrender.com/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: reportTitle,
          content: reportContent,
          caseId: selectedCase.id,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao salvar relatório");
      }
      alert("✅ Relatório salvo com sucesso!");
      setReportModalVisible(false);
      await fetchReports(selectedCase.id);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      alert(`❌ Erro: ${errorMessage}`);
      setReportError(errorMessage);
    }
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportContent);
    alert("✅ Relatório copiado para a área de transferência!");
  };

  const handleViewReport = (report: Report) => {
  setReportTitle(report.title);
  setReportContent(report.content);
  setReportModalVisible(true);
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
              <Link href={`/vitima`} className={casosStyles.link}>Vítima</Link>
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
            <div className={casosStyles.icone}>
              <FaChartBar className={casosStyles.iconeInterno} />
              <Link href={`/dashboard`} className={casosStyles.link}>Dashboard</Link>
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
            placeholder="Pesquisar por caso ou vítima"
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
            placeholder="Pesquisar por caso ou vítima"
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
                <div className={casosStyles.organizacao}>
                  <label>
                    Data do Fato* <br />
                    <input
                      type="date"
                      name="dateFact"
                      value={formData.dateFact}
                      onChange={handleInputChange}
                      required
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
                      <option value="">Selecione</option>
                      <option value="ANDAMENTO">Em andamento</option>
                      <option value="FINALIZADO">Finalizado</option>
                      <option value="ARQUIVADO">Arquivado</option>
                    </select>
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Vítimas* <br />
                    <select
                      name="victims"
                      multiple
                      value={formData.victims}
                      onChange={handleVictimChange}
                      required
                    >
                      <option value="">Selecione as vítimas</option>
                      {victims.map((victim) => (
                        <option key={victim.id} value={victim.id}>
                          {victim.name}
                        </option>
                      ))}
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
                        statusCase: "",
                        solicitante: "",
                        dateFact: "",
                        victims: [],
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
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Data do Fato</th>
                  <th>Responsável</th>
                  <th>Vítimas</th>
                  <th>Status</th>
                  <th>Solicitar Exames</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCasos.length > 0 ? (
                  filteredCasos.map((caso) => (
                    <tr key={caso.id}>
                      <td data-label="Título">{caso.title}</td>
                      <td data-label="Descrição">{caso.description}</td>
                      <td data-label="Tipo">{caso.classification}</td>
                      <td data-label="Data do Fato">
                        {new Date(caso.dateFact).toLocaleDateString()}
                      </td>
                      <td data-label="Responsável">{getManagerName(caso.managerId)}</td>
                      <td data-label="Vítimas">
                        {Array.isArray(caso.victims) && caso.victims.length > 0
                          ? caso.victims
                              .map((victimId) => {
                                const victim = victims.find((v) => v.id === victimId);
                                return victim ? victim.name : "-";
                              })
                              .join(", ")
                          : "-"}
                      </td>
                      <td data-label="Status">
                        <span className={casosStyles[`status${caso.statusCase}`]}>
                          {caso.statusCase}
                        </span>
                      </td>
                      <td data-label="Solicitar Exames">
                        <button className={casosStyles.botaoExame}>Solicitar Exame</button>
                      </td>
                      <td data-label="Ações" className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Visualizar"
                          onClick={() => handleViewCase(caso)}
                        >
                          👁️
                        </button>
                        {(currentUserRole === "ADMIN" || currentUserRole === "PERITO") && (
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
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>Nenhum caso encontrado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal de Detalhes do Caso */}
        {modalVisible && selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Detalhes do Caso</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold">ID:</label>
                  <p>{selectedCase.id}</p>
                </div>
                <div>
                  <label className="font-semibold">Título:</label>
                  <p>{selectedCase.title}</p>
                </div>
                <div>
                  <label className="font-semibold">Descrição:</label>
                  <p>{selectedCase.description}</p>
                </div>
                <div>
                  <label className="font-semibold">Data do Fato:</label>
                  <p>{new Date(selectedCase.dateFact).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-semibold">Classificação:</label>
                  <p>{selectedCase.classification}</p>
                </div>
                <div>
                  <label className="font-semibold">Responsável:</label>
                  <p>{getManagerName(selectedCase.managerId)}</p>
                </div>
                <div>
                  <label className="font-semibold">Solicitante:</label>
                  <p>{selectedCase.solicitante || "-"}</p>
                </div>
                <div>
                  <label className="font-semibold">Status:</label>
                  <p>{selectedCase.statusCase}</p>
                </div>
                <div>
                  <label className="font-semibold">Vítimas:</label>
                  <p>
                    {Array.isArray(selectedCase.victims) && selectedCase.victims.length > 0
                      ? selectedCase.victims
                          .map((victimId) => {
                            const victim = victims.find((v) => v.id === victimId);
                            return victim ? victim.name : "-";
                          })
                          .join(", ")
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="font-semibold">Exames Solicitados:</label>
                  {(() => {
                    try {
                      if (!selectedCase.content) return <p>Nenhum exame solicitado</p>;
                      const parsedContent = JSON.parse(selectedCase.content);
                      if (Array.isArray(parsedContent.requestedExams) && parsedContent.requestedExams.length > 0) {
                        return parsedContent.requestedExams.map((exam: Exam, index: number) => (
                          <p key={index}>
                            {exam.exam} (Solicitado em: {new Date(exam.date).toLocaleDateString("pt-BR")})
                          </p>
                        ));
                      }
                      return <p>Nenhum exame solicitado</p>;
                    } catch (e) {
                      console.error("Erro ao parsear content:", e);
                      return <p>Erro ao carregar exames solicitados</p>;
                    }
                  })()}
                </div>
                <div>
                  <label className="font-semibold">Relatórios Gerados:</label>
                  {Array.isArray(reports) && reports.length > 0 ? (
                    reports.map((report) => (
                      <div key={report.id} className="flex items-center mt-2">
                        <p>
                          {report.title} (Gerado em: {new Date(report.createdAt).toLocaleDateString("pt-BR")})
                        </p>
                        <button
                          className="ml-4 px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => handleViewReport(report)}
                        >
                          Ver
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Nenhum relatório gerado</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex space-x-2">
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? "Gerando Laudo..." : "Gerar Laudo"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => setModalVisible(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Relatório */}
        {reportModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Laudo Pericial</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold">Título:</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold">Conteúdo:</label>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-1">
                    {reportContent ? (
                      <ReactMarkdown>{reportContent}</ReactMarkdown>
                    ) : (
                      <p className="text-gray-500">Nenhum conteúdo disponível</p>
                    )}
                  </div>
                </div>
                {reportError && (
                  <p className="text-red-500">{reportError}</p>
                )}
              </div>
              <div className="mt-6 flex space-x-2">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  onClick={handleSaveReport}
                >
                  Salvar Laudo
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleCopyReport}
                >
                  Copiar Laudo
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                  onClick={() => setReportModalVisible(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}