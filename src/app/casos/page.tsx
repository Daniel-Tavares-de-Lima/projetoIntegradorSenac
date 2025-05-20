"use client"; // Indica que este componente é executado no lado do cliente (Next.js)

import Image from "next/image"; // Componente do Next.js para renderização otimizada de imagens
import casosStyles from "../styles/Home.module.css"; // Importa estilos CSS modulares para o componente
import Link from "next/link"; // Componente do Next.js para navegação entre páginas
import { createCase, updateCase, deleteCase } from "../services/casosService"; // Funções de serviço para gerenciar casos (criar, atualizar, excluir)
import { FaRegUser, FaChartBar } from "react-icons/fa6"; // Ícones de usuário e dashboard
import { SiElectronbuilder } from "react-icons/si"; // Ícone para profissionais
import { BiSolidUserBadge } from "react-icons/bi"; // Ícone para casos
import { TbFileSearch } from "react-icons/tb"; // Ícone para evidências
import { useState, useEffect } from "react"; // Hooks do React para gerenciamento de estado e efeitos colaterais
import { getUserInfo } from "../services/infoUserServices"; // Serviço para obter informações do usuário logado

// Define a interface Caso para tipagem dos dados de casos periciais
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
}

// Define a interface User para tipagem dos dados de usuários
interface User {
  id: string;
  name: string;
  role: string;
}

// Componente principal Casos
export default function Casos() {
  // Estados para gerenciar dados do componente
  const [casos, setCasos] = useState<Caso[]>([]); // Armazena a lista de casos periciais
  const [filteredCasos, setFilteredCasos] = useState<Caso[]>([]); // Armazena a lista filtrada de casos
  const [searchTerm, setSearchTerm] = useState(""); // Controla o termo de busca
  const [usuarios, setUsuarios] = useState<User[]>([]); // Armazena a lista de usuários (peritos)
  const [userName, setUserName] = useState<string>("Usuário"); // Nome do usuário logado
  const [formData, setFormData] = useState({ // Dados do formulário para criar/editar casos
    title: "",
    description: "",
    classification: "",
    peritoResponsavel: "",
    statusCase: "" as "" | "ANDAMENTO" | "FINALIZADO" | "ARQUIVADO",
    solicitante: "",
    dateFact: "",
  });
  const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro
  const [editCaseId, setEditCaseId] = useState<string | null>(null); // ID do caso em edição
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // Papel do usuário logado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla a visibilidade da barra lateral

  // Função auxiliar para formatar mensagens de erro
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Erro desconhecido";
  }

  // Função para buscar casos da API
  const fetchCasos = async () => {
    try {
      const response = await fetch("https://pi3p.onrender.com/cases", { // Requisição GET para obter casos
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Autenticação via token JWT
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar casos");
      }
      const casosArray = Array.isArray(data) ? data : data.cases || []; // Normaliza a resposta da API
      setCasos(casosArray); // Atualiza o estado com a lista de casos
      setFilteredCasos(casosArray); // Inicializa a lista filtrada
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
      setCasos([]); // Limpa a lista de casos
      setFilteredCasos([]); // Limpa a lista filtrada
    }
  };

  // Função para buscar usuários da API
  const fetchUsuarios = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("⚠️ Usuário não autenticado. Faça login novamente."); // Verifica se há token
      return;
    }
    try {
      const response = await fetch("https://pi3p.onrender.com/users", { // Requisição GET para obter usuários
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
      setUsuarios(data); // Atualiza o estado com a lista de usuários
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
    }
  };

  // Função para filtrar casos com base no termo de busca
  const handleSearch = (term: string) => {
    setSearchTerm(term); // Atualiza o termo de busca
    if (!term.trim()) {
      setFilteredCasos(casos); // Se não houver termo, exibe todos os casos
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = casos.filter(
      (caso) =>
        caso.title.toLowerCase().includes(lowerTerm) ||
        caso.description.toLowerCase().includes(lowerTerm) ||
        (caso.solicitante && caso.solicitante.toLowerCase().includes(lowerTerm))
    ); // Filtra casos por título, descrição ou solicitante
    setFilteredCasos(filtered); // Atualiza a lista filtrada
  };

  // Hook useEffect para carregar dados iniciais
  useEffect(() => {
    const userInfo = getUserInfo(); // Obtém informações do usuário logado
    if (!userInfo) {
      setError("⚠️ Não foi possível obter informações do usuário. Faça login novamente.");
      window.location.href = "/login"; // Redireciona se não houver informações
      return;
    }

    setUserName(userInfo.name || "Usuário Desconhecido"); // Define o nome do usuário
    setCurrentUserRole(userInfo.role || "UNKNOWN"); // Define o papel do usuário

    fetchCasos(); // Carrega os casos
    fetchUsuarios(); // Carrega os usuários
  }, []); // Executa apenas na montagem do componente

  // Função para atualizar o estado do formulário
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Atualiza o campo correspondente
  };

  // Função para salvar ou atualizar um caso
  const saveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.classification || !formData.peritoResponsavel || !formData.dateFact) {
      setError("⚠️ Preencha todos os campos obrigatórios: título, descrição, tipo, perito responsável e data do fato");
      return; // Valida campos obrigatórios
    }
    if (!["ANDAMENTO", "FINALIZADO", "ARQUIVADO"].includes(formData.statusCase)) {
      setError("⚠️ Selecione um status válido: Em andamento, Finalizado ou Arquivado");
      return; // Valida o status
    }
    try {
      if (editCaseId) {
        await updateCase( // Atualiza um caso existente
          editCaseId,
          formData.title,
          formData.description,
          formData.classification,
          formData.peritoResponsavel,
          formData.statusCase,
          formData.solicitante,
          formData.dateFact
        );
        alert("✅ Caso atualizado com sucesso!");
        setEditCaseId(null); // Limpa o modo de edição
      } else {
        const novoCaso = await createCase( // Cria um novo caso
          formData.title,
          formData.description,
          formData.classification,
          formData.peritoResponsavel,
          formData.solicitante,
          formData.dateFact,
          formData.statusCase
        );
        setCasos((prev) => [...prev, novoCaso]); // Adiciona o novo caso à lista
        alert("✅ Caso salvo com sucesso!");
      }
      setFormData({ // Reseta o formulário
        title: "",
        description: "",
        classification: "",
        peritoResponsavel: "",
        statusCase: "",
        solicitante: "",
        dateFact: "",
      });
      setError(null); // Limpa erros
      fetchCasos(); // Atualiza a lista de casos
    } catch (err) {
      setError(getErrorMessage(err)); // Define mensagem de erro
      alert(`❌ Erro: ${err}`);
    }
  };

  // Função para preencher o formulário com dados de um caso existente
  const handleEdit = (caso: Caso) => {
    setEditCaseId(caso.id); // Define o ID do caso em edição
    setFormData({
      title: caso.title,
      description: caso.description,
      classification: caso.classification,
      peritoResponsavel: caso.managerId,
      statusCase: caso.statusCase as "ANDAMENTO" | "FINALIZADO" | "ARQUIVADO",
      solicitante: caso.solicitante || "",
      dateFact: caso.dateFact || "",
    }); // Preenche o formulário
  };

  // Função para excluir um caso
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar este caso?")) return; // Confirmação do usuário
    try {
      await deleteCase(id); // Chama a função de exclusão
      alert("✅ Caso desativado com sucesso!");
      fetchCasos(); // Atualiza a lista de casos
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
    }
  };

  // Função para obter o nome do perito responsável
  const getManagerName = (managerId: string) => {
    const user = usuarios.find((u) => u.id === managerId);
    return user ? user.name : "-"; // Retorna o nome ou "-" se não encontrado
  };

  // Função para alternar a visibilidade da barra lateral
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Inverte o estado da barra lateral
  };

  // Estrutura do componente (JSX)
  return (
    <div className={casosStyles.container}> {/* Contêiner principal */}
      <button className={casosStyles.hamburger} onClick={toggleSidebar}>
        {isSidebarOpen ? "✖" : "☰"} {/* Botão para abrir/fechar a barra lateral */}
      </button>
      <aside className={`${casosStyles.sidebar} ${isSidebarOpen ? casosStyles.open : ""}`}>
        <div>
          <div className={casosStyles.logo}> {/* Seção do logo */}
            <Image
              src={`/imagens/Logo - Laudo.png`} // Placeholder para o logo
              alt="Logo - Laudo"
              width={60}
              height={60}
            />
            <h1>
              <Link href={`/home`} className={casosStyles.titulo}>
                Laudos Periciais Odonto-Legal {/* Título do sistema */}
              </Link>
            </h1>
          </div>
          <nav className={casosStyles.navi}> {/* Menu de navegação */}
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
            <div className={casosStyles.icone}>
              <FaChartBar className={casosStyles.iconeInterno} />
              <Link href={`/dashboard`} className={casosStyles.link}>Dashboard</Link>
            </div>
          </nav>
        </div>
        <div className={casosStyles.config}>⚙️ Configurações</div> {/* Link para configurações */}
      </aside>

      <main className={casosStyles.main}> {/* Seção principal */}
        <header className={casosStyles.header}> {/* Cabeçalho */}
          <div className={casosStyles.logoApp}>
            Gest<span>Odo</span> {/* Nome estilizado do app */}
          </div>
          <input
            type="search"
            placeholder="Pesquisar por caso"
            className={casosStyles.pesquisa}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)} // Campo de busca
          />
          <div className={casosStyles.user}>
            <FaRegUser /> {userName} {/* Exibe o nome do usuário logado */}
          </div>
        </header>

        <section className={casosStyles.content}> {/* Conteúdo principal */}
          <h1>Casos</h1>
          {error && <p className={casosStyles.error}>{error}</p>} {/* Exibe erros, se houver */}

          <h2>Pesquisar</h2>
          <input
            type="search"
            placeholder="Pesquisar por caso"
            className={casosStyles.pesquisa}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)} // Campo de busca redundante
          />
          <div className={casosStyles.conteudo}>
            <button
              className={casosStyles.botaoPesquisar}
              onClick={() => handleSearch(searchTerm)} // Botão para confirmar busca
            >
              🔍 Pesquisar
            </button>
          </div>

          <div className={casosStyles.section}> {/* Formulário e tabela */}
            <h2>{editCaseId ? "Editar Caso" : "Cadastrar Caso"}</h2> {/* Título dinâmico */}
            <form onSubmit={saveCase} className={casosStyles.cadastroCasos}> {/* Formulário de cadastro/edição */}
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
                        .filter((user) => user.role === "PERITO") // Filtra apenas peritos
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
                <button type="submit" className={casosStyles.botaoSalvar}>
                  {editCaseId ? "Salvar Alterações" : "Salvar"} {/* Botão dinâmico para salvar */}
                </button>
                {editCaseId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditCaseId(null);
                      setFormData({ // Reseta o formulário ao cancelar
                        title: "",
                        description: "",
                        classification: "",
                        peritoResponsavel: "",
                        statusCase: "",
                        solicitante: "",
                        dateFact: "",
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
            <table> {/* Tabela para exibir casos */}
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Data do Fato</th>
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
                      <td data-label="Título">{caso.title}</td>
                      <td data-label="Descrição">{caso.description}</td>
                      <td data-label="Tipo">{caso.classification}</td>
                      <td data-label="Data do Fato">
                        {new Date(caso.dateFact).toLocaleDateString()} {/* Formata a data */}
                      </td>
                      <td data-label="Responsável">{getManagerName(caso.managerId)}</td>
                      <td data-label="Status">
                        <span className={casosStyles[`status${caso.statusCase}`]}>
                          {caso.statusCase} {/* Estiliza o status */}
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
                              onClick={() => handleEdit(caso)} // Botão para editar caso
                            >
                              ✏️
                            </button>
                            <button
                              className={casosStyles.acaoBotao}
                              title="Excluir"
                              onClick={() => handleDelete(caso.id)} // Botão para excluir caso
                            >
                              ❌
                            </button>
                          </>
                        ) : (
                          <span>Sem permissões</span> // Exibe mensagem se o usuário não tem permissão
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>Nenhum caso encontrado</td> {/* Mensagem para lista vazia */}
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