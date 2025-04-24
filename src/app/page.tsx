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
import { apiRequest } from "../app/services/apiServices";

export default function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Verifica se o nome já está no localStorage
        const storedName = localStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        } else {
          // Faz uma requisição para obter os dados do usuário logado
          const data = await apiRequest("/auth/me", "GET", null, true);
          if (data.name) {
            setUserName(data.name);
            localStorage.setItem("userName", data.name); // Salva no localStorage
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error.message);
        setUserName("Usuário"); // Fallback em caso de erro
      }
    };

    fetchUserData();
  }, []);

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
            <button className={styles.botaoPesquisar}>➕ Adicionar paciente</button>
            <button className={styles.botaoPesquisar}>📄 Registrar caso</button>
          </div>

          <div className={styles.section}>
            <h2>Casos - Exemplos</h2>
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#022</td>
                  <td>Acidente</td>
                  <td>12/03/25 - 12:43</td>
                  <td>📍 Recife-PE</td>
                  <td>Carlos Andrade</td>
                  <td>Julia Maria</td>
                  <td>14/02/23 - 12:03hrs</td>
                  <td>Exame odontolega...</td>
                  <td>
                    <button className={styles.botaoExame}>Solicitar Exame</button>
                  </td>
                  <td>
                    <span className={styles.statusEmAndamento}>Em andamento</span>
                  </td>
                  <td className={styles.acoes}>✏️</td>
                  <td className={styles.acoes}>❌</td>
                </tr>
                <tr>
                  <td>#021</td>
                  <td>Acidente</td>
                  <td>05/03/25 - 10:33</td>
                  <td>📍 Jaboatão-PE</td>
                  <td>Marcos Silva</td>
                  <td>Julia Maria</td>
                  <td>17/12/22 - 19:14hrs</td>
                  <td>Análise de arcada de...</td>
                  <td>
                    <button className={styles.botaoExame}>Solicitar Exame</button>
                  </td>
                  <td>
                    <span className={styles.statusArquivado}>Arquivado</span>
                  </td>
                  <td className={styles.acoes}>✏️</td>
                  <td className={styles.acoes}>❌</td>
                </tr>
              </tbody>
            </table>

            <h2>Pacientes - Exemplos</h2>
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#022</td>
                  <td>Ana Maria da Silva</td>
                  <td>Feminino</td>
                  <td>12/02/2001</td>
                  <td>Carlos Andrade</td>
                  <td>14/02/23 - 12:03hrs</td>
                  <td>Exame odontolega...</td>
                  <td>
                    <button className={styles.botaoExame}>Solicitar Exame</button>
                  </td>
                  <td className={styles.acoes}>✏️</td>
                  <td className={styles.acoes}>❌</td>
                </tr>
                <tr>
                  <td>#021</td>
                  <td>José Gomes Carvalho</td>
                  <td>Masculino</td>
                  <td>30/08/1997</td>
                  <td>Marcos Silva</td>
                  <td>10/01/22 - 11:43hrs</td>
                  <td>Análise de arcada de...</td>
                  <td>
                    <button className={styles.botaoExame}>Solicitar Exame</button>
                  </td>
                  <td className={styles.acoes}>✏️</td>
                  <td className={styles.acoes}>❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
