"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
{/*-----Icones Side bar-----*/}
import { FaRegUser } from "react-icons/fa6";
import { LuFileUser } from "react-icons/lu";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
{/*-----Icones Side bar-----*/}
// import {useState} from "react";
import { useEffect, useState } from "react";
import { fetchPatients, fetchCases } from "../app/services/homeServices";



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
  const [userName, setUserName] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        } else {
          const response = await fetch("https://pi3p.onrender.com/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          console.log("Resposta do GET /auth/me:", data); // Log para depuração
          if (response.ok && data.name) {
            setUserName(data.name);
            localStorage.setItem("userName", data.name);
          } else {
            throw new Error(data.message || "Erro ao buscar usuário");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error.message);
        setUserName("Usuário");
      }
    };

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

    fetchUserData();
    fetchData();
  }, []);

  const getCaseSolicitante = (caseId: string) => {
    const caso = cases.find((c) => c.id === caseId);
    return caso ? caso.solicitante || "-" : "-";
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
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
            <LuFileUser className={styles.iconeInterno} />
            <Link href={`/cadastros`} className={styles.link}>Cadastros</Link>
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
            <FaRegUser /> {userName || "Usuário"}
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
                  {/* <th>Ações</th> */}
                </tr>
              </thead>
              <tbody>
                {cases.length > 0 ? (
                  cases.map((caso) => (
                    <tr key={caso.id}>
                      <td>{caso.id.slice(0, 4)}</td>
                      <td>{caso.classification || "-"}</td>
                      <td>{caso.dateOpened ? new Date(caso.dateOpened).toLocaleString() : "-"}</td>
                      <td>-</td> {/* Local não disponível */}
                      <td>{caso.solicitante || "-"}</td>
                      <td>{caso.managerId || "-"}</td> {/* Usando managerId como responsável */}
                      <td>-</td> {/* Data do exame não disponível */}
                      <td>-</td> {/* Últimos exames não disponível */}
                      <td>
                        <button className={styles.botaoExame}>Solicitar Exame</button>
                      </td>
                      <td>
                        <span className={styles[`status${caso.statusCase}`] || styles.statusDefault}>
                          {caso.statusCase || "-"}
                        </span>
                      </td>
                      {/* <td className={styles.acoes}>
                        <span>✏️</span>
                        <span>❌</span>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11}>Nenhum caso disponível</td>
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
                  {/* <th>Ações</th> */}
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.id.slice(0, 4)}</td>
                      <td>{patient.name || "-"}</td>
                      <td>{patient.sex || "-"}</td>
                      <td>{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : "-"}</td>
                      <td>{getCaseSolicitante(patient.caseId)}</td>
                      <td>-</td> {/* Data do exame não disponível */}
                      <td>-</td> {/* Últimos exames não disponível */}
                      <td>
                        <button className={styles.botaoExame}>Solicitar Exame</button>
                      </td>
                      {/* <td className={styles.acoes}>
                        <span>✏️</span>
                        <span>❌</span>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9}>Nenhum paciente disponível</td>
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