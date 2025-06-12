"use client"; // Indica que este componente é executado no lado do cliente (Next.js)

import Image from "next/image"; // Componente do Next.js para renderização otimizada de imagens
import Link from "next/link"; // Componente do Next.js para navegação entre páginas
import { FaRegUser, FaChartBar } from "react-icons/fa6"; // Ícones de usuário e dashboard
import { SiElectronbuilder } from "react-icons/si"; // Ícone para profissionais
import { BiSolidUserBadge } from "react-icons/bi"; // Ícone para casos
import { TbFileSearch } from "react-icons/tb"; // Ícone para evidências
import casosStyles from "../styles/Home.module.css"; // Importa estilos CSS modulares para o componente
import { useState, useEffect, useRef } from "react"; // Hooks do React para gerenciamento de estado, efeitos e referências
import { getUserInfo } from "../services/infoUserServices"; // Serviço para obter informações do usuário logado
import Chart from "chart.js/auto"; // Biblioteca Chart.js para criação de gráficos
import { fetchCases } from "../services/casosService"; // Serviço para buscar casos
import { fetchPatients } from "../services/patientServices"; // Serviço para buscar pacientes
import { Chart as ChartJS, registerables } from "chart.js"; // Core do Chart.js
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot"; // Plugin para boxplot

// Registrar o plugin de boxplot no Chart.js
ChartJS.register(...registerables, BoxPlotController, BoxAndWiskers);

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
  dateFact: string; // Novo campo para data do fato
}

// Define a interface Patient para tipagem dos dados de pacientes
interface Patient {
  id: string;
  name: string;
  sex: string;
  birthDate?: string;
  identified: "YES" | "NO";
  caseId: string;
  status: "ATIVADO" | "DESATIVADO";
}

// Componente principal Dashboard
export default function Dashboard() {
  // Estados para gerenciar dados do componente
  const [casos, setCasos] = useState<Caso[]>([]); // Armazena a lista de casos periciais
  const [pacientes, setPacientes] = useState<Patient[]>([]); // Armazena a lista de pacientes
  const [userName, setUserName] = useState<string>("Usuário"); // Nome do usuário logado
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // Papel do usuário logado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla a visibilidade da barra lateral
  const [error, setError] = useState<string | null>(null); // Armazena mensagens de erro
  const [dateFilterStart, setDateFilterStart] = useState<string>("2024-06-01"); // Filtro de data inicial
  const [dateFilterEnd, setDateFilterEnd] = useState<string>("2024-09-30"); // Filtro de data final

  // Referências para armazenar objetos Chart
  const chartRefs = useRef<{
    tipoCaso?: Chart;
    status?: Chart;
    sexo?: Chart;
    freq?: Chart;
    idade?: Chart;
    boxplot?: Chart;
    temporal?: Chart;
  }>({}); // Objeto para gerenciar instâncias de gráficos

  // Função para calcular a idade a partir da data de nascimento
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age; // Retorna a idade calculada
  };

  // Função auxiliar para formatar mensagens de erro
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Erro desconhecido";
  }

  // Função para buscar casos e pacientes da API
  const fetchData = async () => {
    try {
      const casesResponse = await fetchCases(); // Busca casos
      const patientsResponse = await fetchPatients(); // Busca pacientes
      setCasos(Array.isArray(casesResponse) ? casesResponse : casesResponse.cases || []); // Normaliza e atualiza casos
      setPacientes(Array.isArray(patientsResponse) ? patientsResponse : []); // Normaliza e atualiza pacientes
    } catch (error) {
      setError(getErrorMessage(error)); // Define mensagem de erro
    }
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

    fetchData(); // Carrega casos e pacientes
  }, []); // Executa apenas na montagem do componente

  // Hook useEffect para gerar gráficos quando casos ou pacientes mudam
  useEffect(() => {
    if (casos.length === 0 || pacientes.length === 0) return; // Sai se não houver dados

    // Função para destruir gráficos existentes
    const destroyCharts = () => {
      Object.values(chartRefs.current).forEach(chart => {
        if (chart) {
          chart.destroy(); // Destrói instâncias de gráficos existentes
        }
      });
      chartRefs.current = {}; // Reseta as referências
    };

    // Destruir gráficos antes de criar novos
    destroyCharts();

    // Gráfico de barras - Tipo de Caso
    const tipoCasoCanvas = document.getElementById("tipoCasoChart") as HTMLCanvasElement;
    if (tipoCasoCanvas) {
      const tipoCasoData = {
        labels: ["Acidente", "Criminal", "Identificação"], // Rótulos para o gráfico
        datasets: [{
          label: "Número de Casos",
          data: [
            casos.filter(c => c.classification === "ACIDENTE").length, // Conta casos por tipo
            casos.filter(c => c.classification === "CRIMINAL").length,
            casos.filter(c => c.classification === "IDENTIFICACAO").length
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Cores das barras
        }]
      };

      chartRefs.current.tipoCaso = new Chart(tipoCasoCanvas, {
        type: "bar", // Tipo de gráfico: barras
        data: tipoCasoData,
        options: {
          scales: { y: { beginAtZero: true, title: { display: true, text: "Número de Casos" } } }, // Configuração do eixo Y
          plugins: { title: { display: true, text: "Distribuição por Tipo de Caso" } } // Título do gráfico
        }
      });
    }

    // Gráfico de Pizza - Status
    const statusCanvas = document.getElementById("statusChart") as HTMLCanvasElement;
    if (statusCanvas) {
      const statusData = {
        labels: ["Arquivado", "Finalizado", "Em Andamento"], // Rótulos para o gráfico
        datasets: [{
          data: [
            casos.filter(c => c.statusCase === "ARQUIVADO").length, // Conta casos por status
            casos.filter(c => c.statusCase === "FINALIZADO").length,
            casos.filter(c => c.statusCase === "ANDAMENTO").length
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Cores das fatias
        }]
      };

      chartRefs.current.status = new Chart(statusCanvas, {
        type: "pie", // Tipo de gráfico: pizza
        data: statusData,
        options: { plugins: { title: { display: true, text: "Distribuição por Status" } } } // Título do gráfico
      });
    }

    // Gráfico de Pizza - Sexo
    const sexoCanvas = document.getElementById("sexoChart") as HTMLCanvasElement;
    if (sexoCanvas) {
      const sexoData = {
        labels: ["Masculino", "Feminino", "Outro"], // Rótulos para o gráfico
        datasets: [{
          data: [
            pacientes.filter(p => p.sex === "MASCULINO").length, // Conta pacientes por sexo
            pacientes.filter(p => p.sex === "FEMININO").length,
            pacientes.filter(p => p.sex === "OUTRO").length
          ],
          backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"], // Cores das fatias
        }]
      };

      chartRefs.current.sexo = new Chart(sexoCanvas, {
        type: "pie", // Tipo de gráfico: pizza
        data: sexoData,
        options: { plugins: { title: { display: true, text: "Distribuição por Sexo" } } } // Título do gráfico
      });
    }

    // Gráfico de Pizza - Frequência Relativa com Filtro de Data
    const filteredCasos = casos.filter(c => {
      if (!c.dateFact) return false; // Ignora casos sem data
      const caseDate = new Date(c.dateFact);
      const startDate = new Date(dateFilterStart);
      const endDate = new Date(dateFilterEnd);
      return caseDate >= startDate && caseDate <= endDate; // Filtra casos no intervalo de datas
    });

    const freqCanvas = document.getElementById("freqChart") as HTMLCanvasElement;
    if (freqCanvas) {
      const freqData = {
        labels: ["Acidente", "Criminal", "Identificação"], // Rótulos para o gráfico
        datasets: [{
          data: [
            filteredCasos.filter(c => c.classification === "ACIDENTE").length, // Conta casos filtrados por tipo
            filteredCasos.filter(c => c.classification === "CRIMINAL").length,
            filteredCasos.filter(c => c.classification === "IDENTIFICACAO").length
          ],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"], // Cores das fatias
        }]
      };

      chartRefs.current.freq = new Chart(freqCanvas, {
        type: "doughnut", // Tipo de gráfico: rosca
        data: freqData,
        options: { plugins: { title: { display: true, text: "Frequência Relativa dos Casos (06/2024 - 09/2024)" } } } // Título do gráfico
      });
    }

    // Limpeza na desmontagem do componente
    return () => {
      destroyCharts(); // Destrói gráficos ao desmontar o componente
    };
  }, [casos, pacientes, dateFilterStart, dateFilterEnd]); // Dependências do efeito

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
        <div className={casosStyles.config}>⚙️ Configurações</div> {/* Link para configurações */}
      </aside>

      <main className={casosStyles.main}> {/* Seção principal */}
        <header className={casosStyles.header}> {/* Cabeçalho */}
          <div className={casosStyles.logoApp}>
            Gest<span>Odo</span> {/* Nome estilizado do app */}
          </div>
          <input
            type="search"
            placeholder="Pesquisar"
            className={casosStyles.pesquisa} // Campo de busca (não funcional neste código)
          />
          <div className={casosStyles.user}>
            <FaRegUser /> {userName} {/* Exibe o nome do usuário logado */}
          </div>
        </header>

        <section className={casosStyles.content}> {/* Conteúdo principal */}
          <h1>Dashboard</h1>
          {error && <p className={casosStyles.error}>{error}</p>} {/* Exibe erros, se houver */}

          <div className={casosStyles.section}> {/* Seção de filtros e gráficos */}
            <h2>Filtros de Data</h2>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div>
                <label>Data Inicial</label>
                <input
                  type="date"
                  value={dateFilterStart}
                  onChange={(e) => setDateFilterStart(e.target.value)}
                  className={casosStyles.pesquisa} // Filtro de data inicial
                />
              </div>
              <div>
                <label>Data Final</label>
                <input
                  type="date"
                  value={dateFilterEnd}
                  onChange={(e) => setDateFilterEnd(e.target.value)}
                  className={casosStyles.pesquisa} // Filtro de data final
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <canvas id="tipoCasoChart"></canvas> {/* Canvas para gráfico de tipo de caso */}
              </div>
              <div>
                <canvas id="statusChart"></canvas> {/* Canvas para gráfico de status */}
              </div>
              <div>
                <canvas id="sexoChart"></canvas> {/* Canvas para gráfico de sexo */}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <canvas id="temporalChart"></canvas> {/* Canvas para gráfico temporal (não implementado) */}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}