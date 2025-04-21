import Image from "next/image";
// import styles from "./page.module.css";
import casosStyles from "../styles/Home.module.css";
import Link from "next/link";
// import {useState} from "react";

export default function Casos() {
  return (
    <div className={casosStyles.container}>

      {/*--------SIDEBAR ESQUERDA--------------------------*/}
      <aside className={casosStyles.sidebar}>
        {/* <div className={casosStyles.logo}>Laudos Periciais Odonto-Legal</div> */}
        <div>
          <div>  
          </div>

          <div className={casosStyles.logo}>

            <Image src={`/imagens/Logo - Laudo.png`} alt="Logo - Laudo" width={60} height={60} ></Image>
            <h1>
              <Link href={`http://localhost:3000`} className={casosStyles.titulo}>Laudos Periciais Odonto-Legal</Link>
            </h1>
          </div>


          <nav className={casosStyles.navi}>
            <Link href={`/pacientes`} className={casosStyles.link}>Pacientes</Link>
            <Link href={`/cadastros`} className={casosStyles.link}>Cadastros</Link>
            <Link href={`/profissionais`} className={casosStyles.link}>Profissionais</Link>
            <Link href={`/casos`} className={casosStyles.link}>Casos</Link>
            <Link href={`/evidencias`} className={casosStyles.link}>Evidências</Link>
          </nav>
        </div>
        <div className={casosStyles.config}>⚙️ Configurações</div>
      </aside>

      {/*--------SIDEBAR ESQUERDA--------------------------*/}

      <main className={casosStyles.main}>

        {/*--------------HEADER-----------------------*/}
        <header className={casosStyles.header}>
          <div className={casosStyles.logoApp}>
            Gest<span>Odo</span>
          </div>

          <input type="search" placeholder="Pesquisar casos ou pacientes" className={casosStyles.pesquisa}/>

          {/*-----O usuário também tem que vim do backend----*/}
          <div className={casosStyles.user}>👤 Julia</div>
        </header>
        {/*--------------HEADER-----------------------*/}

        <section className={casosStyles.content}>
          <h1>Casos</h1>

          {/*-------------PESQUISAR POR CASOS---------------*/}

          <h2>Pesquisar</h2>
          <input type="search" placeholder="Pesquisar casos ou pacientes" className={casosStyles.pesquisa}/>


          <div className={casosStyles.conteudo}>
            <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
    
          </div>
          {/*-------------CADASTRAR CASOS---------------*/}

          <div className={casosStyles.section}>

            {/*-------------TABELA DE CADASTRAR CASOS---------------*/}
            {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}
            <h2>Cadastrar Casos</h2>

            <div className={casosStyles.cadastroCasos}>

              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                  <label> Titulo do Caso* <br />
                    <input type="text" placeholder="Digite o titulo do caso" required/>
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label> Descrição* <br />
                    <textarea placeholder="Descreva os detalhes do caso" required></textarea>
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>Data do Fato: <br />
                    {/* <select>
                      <option value="">Radiográfico</option>
                      <option value="">Opção 2</option>
                      <option value="">Opção 3</option>
                      <option value="">Opção 4</option>
                    </select> */}
                    <input type="date" required />
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label> Local <br />
                    {/* <select>
                      <option value="">Exame odontologico comparativo</option>
                      <option value="">Opção 2</option>
                      <option value="">Opção 3</option>
                      <option value="">Opção 4</option>
                    </select> */}
                    <input type="text" placeholder="Ex.: Recife, PE" required />
                  </label>
                </div>

              </div>


              <div className={casosStyles.cadastroDireita}>
                {/*---------EXEMPLOS----------*/}
              <div className={casosStyles.organizacao}>
                <label>Tipo de Caso: <br />
                    <select>
                      <option value="">Acidente</option>
                      <option value="">Opção 2</option>
                      <option value="">Opção 3</option>
                      <option value="">Opção 4</option>
                    </select>
                  </label>
              </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>Perito Responsável: 
                    <input type="text" placeholder="Nome do solicitante" />
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>Atribuir Assistente: <br />
                    <select>
                      <option value="">Nenhum</option>
                      <option value="">Opção 2</option>
                      <option value="">Opção 3</option>
                      <option value="">Opção 4</option>
                    </select>
                  </label>
                </div>


                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label> Status <br />
                    <select>
                      <option value="">Em andamento</option>
                      <option value="">Finalizado</option>
                      <option value="">Arquivado</option>
                    </select>
                  </label>
                </div>

                <button>Salvar</button>
              </div>
            </div>
          
          {/*-------------TABELA DE CASOS---------------*/}
          {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}
          
            <h2>Todos os Casos</h2>
            <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Tipo</th>
        <th>Data do Fato</th>
        <th>Local</th>
        <th>Solicitante da Perícia</th>
        <th>Responsável</th>
        <th>Data do Exame</th>
        <th>Últimos Exames</th>
        <th>Solicitar Exames</th>
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
        <td>
          02/22 11:25 AM Exame odontol... <a href="#" className={casosStyles.verTudo}>Ver Tudo</a>
        </td>
        <td>
          <button className={casosStyles.botaoExame}>Solicitar Exame</button>
        </td>
        <td>
          <span className={casosStyles.statusEmAndamento}>Em andamento</span>
        </td>
        <td className={casosStyles.acoes}>
          <button className={casosStyles.acaoBotao} title="Confirmar">✅</button>
          <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
          <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
        </td>
      </tr>
      <tr>
        <td>#021</td>
        <td>Acidente</td>
        <td>05/03/25 - 10:33</td>
        <td>📍 Jaboatão-PE</td>
        <td>Marcos Silva</td>
        <td>Julia Maria</td>
        <td>17/12/22 - 19:14hrs</td>
        <td>
          11/23 09:12 AM Análise de arcada... <a href="#" className={casosStyles.verTudo}>Ver Tudo</a>
        </td>
        <td>
          <button className={casosStyles.botaoExame}>Solicitar Exame</button>
        </td>
        <td>
          <span className={casosStyles.statusArquivado}>Arquivado</span>
        </td>
        <td className={casosStyles.acoes}>
          <button className={casosStyles.acaoBotao} title="Confirmar">✅</button>
          <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
          <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
        </td>
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
