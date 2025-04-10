// import Image from "next/image";
import styles from "./page.module.css";
// import {useState} from "react";

export default function Home() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {/* <div className={styles.logo}>Laudos Periciais Odonto-Legal</div> */}
        <div className="logo">
          <div className="imagem">  
          </div>

          <div className="titulo">
            <h1>Laudos Periciais Odonto-Legal</h1>
          </div>


          <nav className={styles.navi}>
            <a>Pacientes</a>
            <a>Cadastro</a>
            <a>Profissionais</a>
            <a>Casos</a>
          </nav>

         
        </div>
        


        <div className={styles.config}>⚙️ Configurações</div>

      </aside>



      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.logoApp}>
            Gest<span className={styles.highlight}>Odo</span>
          </div>
          <input
            type="search"
            placeholder="Pesquisar casos ou pacientes"
            className={styles.search}
          />
          <div className={styles.user}>👤 Julia</div>
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

          <div className={styles.conteudo}>
            <button className={styles.botaoPesquisar}>➕ Adicionar paciente</button>
            <button className={styles.botaoPesquisar}>📄 Registrar caso</button>
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
                    <span className={styles.statusEmAndamento}>
                      Em andamento
                    </span>
                  </td>
                  <td>✏️ ❌</td>
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
                  <td>✏️ ❌</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.section}>
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
                  <td>✏️ ❌</td>
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
                  <td>✏️ ❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
