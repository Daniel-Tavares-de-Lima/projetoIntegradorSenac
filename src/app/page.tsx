"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
import { useEffect, useState } from "react";
import { fetchPatients, fetchCases } from "../app/services/homeServices";
import { getUserInfo } from "../app/services/infoUserServices"; 

interface Patient {
  id: string;
  name: string;
  sex: string;
  birthDate?: string;
  caseId: string;
  identified: "YES" | "NO";
}

interface Case {
  id: string;
  title: string;
  classification: string;
  dateOpened: string;
  solicitante?: string;
  managerId: string;
  statusCase: string;
}

export default function Home() {
  const [userName, setUserName] = useState<string>("Usuário");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Obtém as informações do usuário usando getUserInfo
    const userInfo = getUserInfo();
    console.log("Informações do usuário:", userInfo);
    if (!userInfo) {
      setError("⚠️ Não foi possível obter informações do usuário. Faça login novamente.");
      window.location.href = "/login";
      return;
    }

    // Define o nome do usuário
    setUserName(userInfo.name || "Usuário Desconhecido");

    const fetchData = async () => {
      try {
        const [patientsData, casesData] = await Promise.all([
          fetchPatients(),
          fetchCases(),
        ]);
        setPatients(patientsData);
        setCases(casesData);
        setError(null);
      } catch (error) {
        setError(`⚠️ ${error.message}`);
        setPatients([]);
        setCases([]);
      }
    };

    fetchData();
  }, []);

  const getCaseSolicitante = (caseId: string) => {
    const caso = cases.find((c) => c.id === caseId);
    return caso ? caso.solicitante || "-" : "-";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <button className={styles.hamburger} onClick={toggleSidebar}>
        {isSidebarOpen ? "✖" : "☰"}
      </button>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.logo}>
          <Image src={`/imagens/Logo - Laudo.png`} alt="Logo - Laudo" width={60} height={60} />
          <h1>
            <Link href={`http://localhost:3000`} className={styles.titulo}>
              Laudos Periciais Odonto-Legal
            </Link>
          </h1>
        </div>

        <nav className={styles.navi}>
          <div className={styles.icone}>
            <FaRegUser className={styles.iconeInterno} />
            <Link href={`/pacientes`} className={styles.link}>Pacientes</Link>
          </div>
          <div className={styles.icone}>
            <SiElectronbuilder className={styles.iconeInterno} />
            <Link href={`/profissionais`} className={styles.link}>Profissionais</Link>
          </div>
          <div className={styles.icone}>
            <BiSolidUserBadge className={styles.iconeInterno} />
            <Link href={`/casos`} className={styles.link}>Casos</Link>
          </div>
          <div className={styles.icone}>
            <TbFileSearch className={styles.iconeInterno} />
            <Link href={`/evidencias`} className={styles.link}>Evidências</Link>
          </div>
        </nav>
        <div className={styles.config}>⚙️ Configurações</div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.logoApp}>
            Gest<span>Odo</span>
          </div>
          <input type="search" placeholder="Pesquisar casos ou pacientes" className={styles.pesquisa} />
          <div className={styles.user}>
            <FaRegUser /> {userName}
          </div>
        </header>

        <section className={styles.content}>
          <h1>Painel Inicial</h1>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.searchSection}>
            <label>
              Data inicial <input type="date" />
            </label>
            <label>
              Data final <input type="date" />
            </label>
            <button className={styles.botaoPesquisar}>Pesquisar</button>
          </div>

          <h2>Mais recentes</h2>
          <input type="search" placeholder="Pesquisar casos ou pacientes" className={styles.pesquisa} />
          <div className={styles.conteudo}>
            <button className={styles.botaoPesquisar}>
              <Link href={`/pacientes`} className={styles.link}>Add pacientes</Link>
            </button>
            <button className={styles.botaoPesquisar}>
              <Link href={`/casos`} className={styles.link}>Add Casos</Link>
            </button>
          </div>

          <div className={styles.section}>
            <h2>Casos</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Data do Fato</th>
                  <th>Local</th>
                  <th>Solicitante</th>
                  <th>Responsável</th>
                  <th>Data do Exame</th>
                  <th>Últimos Exames</th>
                  <th>Solicitar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cases.length > 0 ? (
                  cases.map((caso) => (
                    <tr key={caso.id}>
                      <td data-label="Código">{caso.id.slice(0, 4)}</td>
                      <td data-label="Tipo">{caso.classification || "-"}</td>
                      <td data-label="Data do Fato">{caso.dateOpened ? new Date(caso.dateOpened).toLocaleString() : "-"}</td>
                      <td data-label="Local">-</td>
                      <td data-label="Solicitante">{caso.solicitante || "-"}</td>
                      <td data-label="Responsável">{caso.managerId || "-"}</td>
                      <td data-label="Data do Exame">-</td>
                      <td data-label="Últimos Exames">-</td>
                      <td data-label="Solicitar">
                        <button className={styles.botaoExame}>Solicitar Exame</button>
                      </td>
                      <td data-label="Status">
                        <span className={styles[`status${caso.statusCase}`] || styles.statusDefault}>
                          {caso.statusCase || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10}>Nenhum caso disponível</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h2>Pacientes</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Sexo</th>
                  <th>Data de Nascimento</th>
                  <th>Solicitante</th>
                  <th>Data do Exame</th>
                  <th>Últimos Exames</th>
                  <th>Solicitar</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.id}>
                      <td data-label="Código">{patient.id.slice(0, 4)}</td>
                      <td data-label="Nome">{patient.name || "-"}</td>
                      <td data-label="Sexo">{patient.sex || "-"}</td>
                      <td data-label="Data de Nascimento">{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : "-"}</td>
                      <td data-label="Solicitante">{getCaseSolicitante(patient.caseId)}</td>
                      <td data-label="Data do Exame">-</td>
                      <td data-label="Últimos Exames">-</td>
                      <td data-label="Solicitar">
                        <button className={styles.botaoExame}>Solicitar Exame</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>Nenhum paciente disponível</td>
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