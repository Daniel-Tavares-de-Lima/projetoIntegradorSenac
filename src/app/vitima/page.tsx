"use client"; // Indica que este componente é executado no lado do cliente (Next.js)

import casosStyles from "../styles/Home.module.css"; // Importa estilos CSS modulares
import Image from "next/image"; // Componente do Next.js para renderização otimizada de imagens
import pacientesStyles from "../styles/Pacientes.module.css"; // Estilos reutilizados do módulo de pacientes
import evidenciasStyles from "../styles/Evidencias.module.css"; // Estilos reutilizados do módulo de evidências
import Link from "next/link"; // Componente do Next.js para navegação entre páginas
import { useState, useEffect } from "react"; // Hooks do React para gerenciamento de estado e efeitos
import { FaRegUser, FaChartBar } from "react-icons/fa6"; // Ícones de usuário e dashboard
import { SiElectronbuilder } from "react-icons/si"; // Ícone para profissionais
import { BiSolidUserBadge } from "react-icons/bi"; // Ícone para casos
import { TbFileSearch } from "react-icons/tb"; // Ícone para evidências
import { createVitima, updateVitima, deleteVitima, fetchVitimas, fetchCases } from "../services/vitimaServices"; // Serviços renomeados para vítimas
import { getUserInfo } from "../services/infoUserServices"; // Serviço para obter informações do usuário logado

// Interface para a entidade Vítima
interface Victim {
  id: string;
  nic: string;
  name: string;
  gender: string;
  age: number;
  document: string;
  address: string;
  ethnicity: string;
  odontogram: string;
  anatomicalNotes: string;
  caseId: string;
  status: "ATIVADO" | "DESATIVADO";
}

// Interface para casos (mantida do código original)
interface Case {
  id: string;
  title: string;
  description: string;
  classification: string;
  statusCase: string;
  managerId: string;
  solicitante?: string;
  dateOpened: string;
}

// Componente principal Vítimas
export default function Vitimas() {
  // Estados para gerenciar o componente
  const [mostrarCadastro, setMostrarCadastro] = useState(false); // Controla a exibição do formulário de cadastro
  const [vitimas, setVitimas] = useState<Victim[]>([]); // Armazena a lista de vítimas
  const [filteredVitimas, setFilteredVitimas] = useState<Victim[]>([]); // Armazena a lista filtrada de vítimas
  const [searchTerm, setSearchTerm] = useState(""); // Controla o termo de busca
  const [casos, setCasos] = useState<Case[]>([]); // Armazena a lista de casos
  const [userName, setUserName] = useState<string>("Usuário"); // Nome do usuário logado
  const [formData, setFormData] = useState({ // Dados do formulário para cadastro/edição
    nic: "",
    name: "",
    gender: "",
    age: "",
    document: "",
    address: "",
    ethnicity: "",
    odontogram: "",
    anatomicalNotes: "",
    caseId: "",
  });
  const [editVictimId, setEditVictimId] = useState<string | null>(null); // ID da vítima em edição
  const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // Papel do usuário logado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla a visibilidade da barra lateral

  // Função auxiliar para formatar mensagens de erro
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Erro desconhecido";
  }

  // Função para buscar vítimas
  const fetchVitimas = async () => {
    try {
      const data = await fetchVitimas(); // Usa a função fetchPatients renomeada para vítimas
      const vitimasArray = Array.isArray(data) ? data : [];
      setVitimas(vitimasArray); // Atualiza o estado com a lista de vítimas
      setFilteredVitimas(vitimasArray); // Inicializa a lista filtrada
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
      setVitimas([]); // Limpa a lista de vítimas
      setFilteredVitimas([]); // Limpa a lista filtrada
    }
  };

  // Função para buscar casos
  const fetchCasos = async () => {
    try {
      const data = await fetchCases(); // Usa a função fetchCases
      setCasos(Array.isArray(data) ? data : []); // Atualiza o estado com a lista de casos
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
      setCasos([]); // Limpa a lista de casos
    }
  };

  // Hook useEffect para carregar dados iniciais
  useEffect(() => {
    const userInfo = getUserInfo(); // Obtém informações do usuário logado
    console.log("Informações do usuário:", userInfo);
    if (!userInfo) {
      setError("⚠️ Não foi possível obter informações do usuário. Faça login novamente.");
      window.location.href = "/vitima"; // Redireciona se não houver informações
      return;
    }

    setUserName(userInfo.name || "Usuário Desconhecido"); // Define o nome do usuário
    setCurrentUserRole(userInfo.role || "UNKNOWN"); // Define o papel do usuário

    fetchVitimas(); // Carrega as vítimas
    fetchCasos(); // Carrega os casos
  }, []); // Executa apenas na montagem do componente

  // Função para exibir o formulário de cadastro
  const handleAdicionarVitima = () => {
    setMostrarCadastro(true); // Mostra o formulário
  };

  // Função para voltar à lista de vítimas
  const handleVoltar = () => {
    setMostrarCadastro(false); // Esconde o formulário
    setEditVictimId(null); // Limpa o modo de edição
    setFormData({ // Reseta o formulário
      nic: "",
      name: "",
      gender: "",
      age: "",
      document: "",
      address: "",
      ethnicity: "",
      odontogram: "",
      anatomicalNotes: "",
      caseId: "",
    });
    setError(null); // Limpa erros
  };

  // Função para atualizar o estado do formulário
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Atualiza o campo correspondente
  };

  // Função para salvar ou atualizar uma vítima
  const saveVictim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nic || !formData.name || !formData.gender || !formData.age || !formData.document || !formData.address || !formData.ethnicity || !formData.odontogram || !formData.anatomicalNotes || !formData.caseId) {
      setError("⚠️ Preencha todos os campos obrigatórios"); // Valida campos obrigatórios
      return;
    }

    try {
      if (editVictimId) {
        await updateVitima( // Usa a função updatePatient renomeada para vítimas
          editVictimId,
          formData.nic,
          formData.name,
          formData.gender,
          parseInt(formData.age),
          formData.document,
          formData.address,
          formData.ethnicity,
          formData.odontogram,
          formData.anatomicalNotes,
          formData.caseId
        );
        alert("✅ Vítima atualizada com sucesso!");
        setEditVictimId(null); // Limpa o modo de edição
      } else {
        await createVitima( // Usa a função createPatient renomeada para vítimas
          formData.nic,
          formData.name,
          formData.gender,
          parseInt(formData.age),
          formData.document,
          formData.address,
          formData.ethnicity,
          formData.odontogram,
          formData.anatomicalNotes,
          formData.caseId
        );
        alert("✅ Vítima salva com sucesso!");
      }
      setFormData({ // Reseta o formulário
        nic: "",
        name: "",
        gender: "",
        age: "",
        document: "",
        address: "",
        ethnicity: "",
        odontogram: "",
        anatomicalNotes: "",
        caseId: "",
      });
      setError(null); // Limpa erros
      setMostrarCadastro(false); // Esconde o formulário
      fetchVitimas(); // Atualiza a lista de vítimas
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
    }
  };

  // Função para preencher o formulário com dados de uma vítima existente
  const handleEdit = (vitima: Victim) => {
    setEditVictimId(vitima.id); // Define o ID da vítima em edição
    setFormData({
      nic: vitima.nic,
      name: vitima.name,
      gender: vitima.gender,
      age: vitima.age.toString(),
      document: vitima.document,
      address: vitima.address,
      ethnicity: vitima.ethnicity,
      odontogram: vitima.odontogram,
      anatomicalNotes: vitima.anatomicalNotes,
      caseId: vitima.caseId,
    }); // Preenche o formulário
    setMostrarCadastro(true); // Mostra o formulário
  };

  // Função para excluir uma vítima
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar esta vítima?")) return; // Confirmação do usuário
    try {
      await deleteVitima(id); // Usa a função deletePatient renomeada para vítimas
      alert("✅ Vítima desativada com sucesso!");
      fetchVitimas(); // Atualiza a lista de vítimas
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
    }
  };

  // Função para obter o solicitante do caso
  const getCaseSolicitante = (caseId: string) => {
    const caso = casos.find((c) => c.id === caseId);
    return caso ? caso.solicitante || "-" : "-"; // Retorna o solicitante ou "-"
  };

  // Função para pesquisar vítimas
  const handleSearch = (term: string) => {
    setSearchTerm(term); // Atualiza o termo de busca
    if (!term.trim()) {
      setFilteredVitimas(vitimas); // Se não houver termo, exibe todas as vítimas
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = vitimas.filter((vitima) => {
      const solicitante = getCaseSolicitante(vitima.caseId);
      return (
        vitima.name.toLowerCase().includes(lowerTerm) ||
        vitima.nic.toLowerCase().includes(lowerTerm) ||
        (solicitante !== "-" && solicitante.toLowerCase().includes(lowerTerm))
      ); // Filtra por nome, NIC ou solicitante
    });
    setFilteredVitimas(filtered); // Atualiza a lista filtrada
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
              <Link href={`/vitimas`} className={casosStyles.link}>Vítimas</Link>
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
            placeholder="Pesquisar por vítima"
            className={casosStyles.pesquisa}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)} // Campo de busca
          />
          <div className={casosStyles.user}>
            <FaRegUser /> {userName} {/* Exibe o nome do usuário logado */}
          </div>
        </header>

        <section className={casosStyles.content}> {/* Conteúdo principal */}
          {error && <p className={casosStyles.error}>{error}</p>} {/* Exibe erros, se houver */}
          {!mostrarCadastro ? (
            <>
              <h1>Painel de Vítimas</h1>
              <h2>Pesquisar</h2>
              <div className={pacientesStyles.filtroData}>
                <div className={pacientesStyles.dataField}>
                  <label>Data inicial</label>
                  <input
                    type="date"
                    placeholder="DD/MM/AAAA"
                    className={pacientesStyles.dataInput} // Filtro de data (não funcional neste código)
                  />
                </div>
                <div className={pacientesStyles.dataField}>
                  <label>Data final</label>
                  <input
                    type="date"
                    placeholder="DD/MM/AAAA"
                    className={pacientesStyles.dataInput} // Filtro de data (não funcional neste código)
                  />
                </div>
              </div>
              <input
                type="search"
                placeholder="Pesquisar por vítima"
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

              <h2>Mais recentes</h2>
              <div className={pacientesStyles.botoesAcao}>
                <button className={pacientesStyles.btnAdicionar} onClick={handleAdicionarVitima}>
                  <span>+</span> Adicionar vítima {/* Botão para adicionar nova vítima */}
                </button>
                <Link href="/casos">
                  <button className={pacientesStyles.btnRegistrar}>
                    <span>📝</span> Registrar caso {/* Botão para registrar caso */}
                  </button>
                </Link>
              </div>

              <h3>Vítimas</h3>
              <div className={casosStyles.section}>
                <table>
                  <thead>
                    <tr>
                      <th>NIC</th>
                      <th>Nome</th>
                      <th>Gênero</th>
                      <th>Idade</th>
                      <th>Documento</th>
                      <th>Endereço</th>
                      <th>Cor/Etnia</th>
                      <th>Odontograma</th>
                      <th>Anotações Anatômicas</th>
                      <th>Solicitar Exames</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVitimas.length > 0 ? (
                      filteredVitimas.map((vitima) => (
                        <tr key={vitima.id}>
                          <td>{vitima.nic}</td>
                          <td>{vitima.name}</td>
                          <td>{vitima.gender}</td>
                          <td>{vitima.age}</td>
                          <td>{vitima.document}</td>
                          <td>{vitima.address}</td>
                          <td>{vitima.ethnicity}</td>
                          <td>{vitima.odontogram}</td>
                          <td>{vitima.anatomicalNotes}</td>
                          <td>
                            <button className={casosStyles.botaoExame}>Solicitar Exame</button>
                          </td>
                          <td className={casosStyles.acoes}>
                            {currentUserRole === "ADMIN" || currentUserRole === "PERITO" ? (
                              <>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Editar"
                                  onClick={() => handleEdit(vitima)} // Botão para editar vítima
                                >
                                  ✏️
                                </button>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Excluir"
                                  onClick={() => handleDelete(vitima.id)} // Botão para excluir vítima
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
                        <td colSpan={11}>Nenhuma vítima encontrada</td> 
                      </tr> // Mensagem para lista vazia
                    )}
                  </tbody>
                </table>
              </div>

              <h3>Casos</h3>
              <div className={casosStyles.section}>
                <table>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Data do Fato</th>
                      <th>Solicitar Exames</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casos.length > 0 ? (
                      casos.map((caso) => (
                        <tr key={caso.id}>
                          <td>{caso.classification}</td>
                          <td>{new Date(caso.dateOpened).toLocaleString()}</td>
                          <td>
                            <button className={casosStyles.botaoExame}>Solicitar Exame</button>
                          </td>
                          <td>
                            <span className={pacientesStyles[`status${caso.statusCase}`]}>
                              {caso.statusCase} {/* Estiliza o status */}
                            </span>
                          </td>
                          <td className={casosStyles.acoes}>
                            <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
                            <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>Nenhum caso disponível</td> 
                      </tr> // Mensagem para lista vazia
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className={pacientesStyles.headerCadastro}>
                <button className={pacientesStyles.btnVoltar} onClick={handleVoltar}>
                  <span>←</span> Voltar {/* Botão para voltar à lista */}
                </button>
                <h1>{editVictimId ? "Editar Vítima" : "Cadastrar Vítima"}</h1> {/* Título dinâmico */}
              </div>
              <div className={casosStyles.section}>
                <form className={casosStyles.cadastroCasos} onSubmit={saveVictim}>
                  <div className={casosStyles.cadastroEsquerda}>
                    <div className={casosStyles.organizacao}>
                      <label>
                        NIC: <br />
                        <input
                          type="text"
                          name="nic"
                          placeholder="Digite o NIC"
                          value={formData.nic}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Nome: <br />
                        <input
                          type="text"
                          name="name"
                          placeholder="Digite o nome completo"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Gênero: <br />
                        <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                          <option value="">Selecione</option>
                          <option value="FEMININO">Feminino</option>
                          <option value="MASCULINO">Masculino</option>
                          <option value="OUTRO">Outro</option>
                        </select>
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Idade: <br />
                        <input
                          type="number"
                          name="age"
                          placeholder="Digite a idade"
                          value={formData.age}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Documento: <br />
                        <input
                          type="text"
                          name="document"
                          placeholder="Digite o documento"
                          value={formData.document}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <div className={casosStyles.cadastroDireita}>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Endereço: <br />
                        <input
                          type="text"
                          name="address"
                          placeholder="Digite o endereço"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Cor/Etnia: <br />
                        <input
                          type="text"
                          name="ethnicity"
                          placeholder="Digite a cor/etnia"
                          value={formData.ethnicity}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Odontograma: <br />
                        <textarea
                          name="odontogram"
                          placeholder="Descreva o odontograma"
                          value={formData.odontogram}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Anotações Anatômicas: <br />
                        <textarea
                          name="anatomicalNotes"
                          placeholder="Descreva as anotações anatômicas"
                          value={formData.anatomicalNotes}
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Caso: <br />
                        <select name="caseId" value={formData.caseId} onChange={handleInputChange} required>
                          <option value="">Selecione</option>
                          {casos.map((caso) => (
                            <option key={caso.id} value={caso.id}>
                              {caso.title} {/* Lista os casos disponíveis */}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <button type="submit" className={evidenciasStyles.btnSalvar}>
                      {editVictimId ? "Salvar Alterações" : "Salvar"} {/* Botão dinâmico para salvar */}
                    </button>
                    {editVictimId && (
                      <button
                        type="button"
                        className={evidenciasStyles.btnSalvar}
                        onClick={handleVoltar}
                      >
                        Cancelar {/* Botão para cancelar edição */}
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <h3>Todas as Vítimas</h3>
              <div className={casosStyles.section}>
                <table>
                  <thead>
                    <tr>
                      <th>NIC</th>
                      <th>Nome</th>
                      <th>Gênero</th>
                      <th>Idade</th>
                      <th>Documento</th>
                      <th>Endereço</th>
                      <th>Cor/Etnia</th>
                      <th>Odontograma</th>
                      <th>Anotações Anatômicas</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVitimas.length > 0 ? (
                      filteredVitimas.map((vitima) => (
                        <tr key={vitima.id}>
                          <td>{vitima.nic}</td>
                          <td>{vitima.name}</td>
                          <td>{vitima.gender}</td>
                          <td>{vitima.age}</td>
                          <td>{vitima.document}</td>
                          <td>{vitima.address}</td>
                          <td>{vitima.ethnicity}</td>
                          <td>{vitima.odontogram}</td>
                          <td>{vitima.anatomicalNotes}</td>
                          <td className={casosStyles.acoes}>
                            {currentUserRole === "ADMIN" || currentUserRole === "PERITO" ? (
                              <>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Editar"
                                  onClick={() => handleEdit(vitima)} // Botão para editar vítima
                                >
                                  ✏️
                                </button>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Excluir"
                                  onClick={() => handleDelete(vitima.id)} // Botão para excluir vítima
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
                        <td colSpan={10}>Nenhuma vítima encontrada</td> 
                      </tr> // Mensagem para lista vazia
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}