// import Image from "next/image";
import styles from "./page.module.css";
// import {useState} from "react";

export default function Home() {
  return (
    <div className={styles.container}>

      {/*--------SIDEBAR ESQUERDA--------------------------*/}
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
            <a>Evidências</a>
          </nav>
        </div>
        <div className={styles.config}>⚙️ Configurações</div>
      </aside>

      {/*--------SIDEBAR ESQUERDA--------------------------*/}

      <main className={styles.main}>

        {/*--------------HEADER-----------------------*/}
        <header className={styles.header}>
          <div className={styles.logoApp}>
            Gest<span>Odo</span>
          </div>

          <input type="search" placeholder="Pesquisar casos ou pacientes" className={styles.pesquisa}/>

          {/*-----O usuário também tem que vim do backend----*/}
          <div className={styles.user}>👤 Julia</div>
        </header>
        {/*--------------HEADER-----------------------*/}

        <section className={styles.content}>
          <h1>Painel Inicial</h1>


          {/*--------BUSCA POR DATA-------------*/}
          <div className={styles.searchSection}>
            <label>
              Data inicial <input type="date" />
            </label>
            <label>
              Data final <input type="date" />
            </label>
            <button className={styles.botaoPesquisar}>Pesquisar</button>
          </div>
          {/*--------BUSCA POR DATA-------------*/}

          {/*-------------ADICIONAR PACIENTES---------------*/}

          <h2>Mais recentes</h2>
          <input type="search" placeholder="Pesquisar casos ou pacientes" className={styles.pesquisa}/>
          

          <div className={styles.conteudo}>
            <button className={styles.botaoPesquisar}>➕ Adicionar paciente</button>
            <button className={styles.botaoPesquisar}>📄 Registrar caso</button>
          </div>
          {/*-------------ADICIONAR PACIENTES---------------*/}

          <div className={styles.section}>

            {/*-------------TABELA DE CASOS---------------*/}
            {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}
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
          
          {/*-------------TABELA DE CASOS---------------*/}
          {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}

          {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}
          {/*-------------TABELA DE PACIENTES---------------*/}
          
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
            {/*-------------TABELA DE PACIENTES---------------*/}
            {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}

          </div>
        </section>
      </main>
    </div>
  );
}
