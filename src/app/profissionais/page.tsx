// import Image from "next/image";
// import styles from "./page.module.css";
import casosStyles from "../styles/Home.module.css";
import profissionaisStyles from "../styles/Profissionais.module.css";
import Link from "next/link";
// import {useState} from "react";

export default function Profissionais() {
  return (
    <div className={casosStyles.container}>

      {/*--------SIDEBAR ESQUERDA--------------------------*/}
      <aside className={casosStyles.sidebar}>
        {/* <div className={casosStyles.logo}>Laudos Periciais Odonto-Legal</div> */}
        <div className="logo">
          <div className="imagem">  
          </div>

          <div className="titulo">
            <h1>Laudos Periciais Odonto-Legal</h1>
          </div>


          <nav className={casosStyles.navi}>
            <Link href={`/pacientes`} className={casosStyles.link}>Pacientes</Link>
            <Link href={`/cadastro`} className={casosStyles.link}>Cadastros</Link>
            <Link href={`/profissionais`} className={casosStyles.link}>Profissionais</Link>
            <Link href={`/casos`} className={casosStyles.link}>Casos</Link>
            <Link href={`evidencias`} className={casosStyles.link}>Evidências</Link>
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
          <h1>Profissionais</h1>

          {/*-------------PESQUISAR POR CASOS---------------*/}

          <h2>Pesquisar</h2>
          <input type="search" placeholder="Pesquisar por usuário" className={casosStyles.pesquisa}/>


          <div className={casosStyles.conteudo}>
            <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
    
          </div>
          {/*-------------CADASTRAR CASOS---------------*/}

          <div className={casosStyles.section}>

            {/*-------------TABELA DE CADASTRAR CASOS---------------*/}
            {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}
            <h2>Cadastrar profissionais</h2>

            <div className={casosStyles.cadastroCasos} >

              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                  <label> Nome Completo <br />
                    <input type="text" placeholder="Digite o nome completo" required/>
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label> E-mail* <br />
                    <input type="email" placeholder="Digite o email" required/>
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>Senha: <br />
                    <input type="password" required placeholder="Digite a senha"/>
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}

              </div>


              <div className={casosStyles.cadastroDireita}>



                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label> Matricula* <br />
                    <input type="number" placeholder="Digite a matricula" required/>
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
              <div className={casosStyles.organizacao}>
                <label>Perfil de acesso: <br />
                    <select>
                      <option value="">Admin</option>
                      <option value="">Perito</option>
                      <option value="">Assistente</option>
                    </select>
                  </label>
              </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>Data de Nascimento: 
                    <input type="date"  required />
                  </label>
                </div>

                <button>Salvar</button>
              </div>
            </div>
          
          
          {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}
          
            <h2>Todos os profissionais</h2>
            <table>
                <thead>
                    <tr>
                        <th>Matricula</th>
                        <th>Nome</th>
                        <th>Data de Nascimento</th>
                        <th>Nivel de acesso</th>
                        {/* <th>Solicitante da Perícia</th>
                        <th>Responsável</th>
                        <th>Data do Exame</th>
                        <th>Últimos Exames</th>
                        <th>Solicitar Exames</th>
                        <th>Status</th> */}
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>012345</td>
                        <td>Julia Gomes Santana</td>
                        <td>12/03/25</td>
                        <td>
                            <div className={profissionaisStyles.acessoADM}>
                                <p>Administrador</p>
                            </div>
                        </td>
                        <td className={casosStyles.acoes}>
                            <button className={casosStyles.acaoBotao} title="Confirmar">✅</button>
                            <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
                            <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
                        </td>
                    </tr>
                    <tr>
                        <td>543210</td>
                        <td>Marcelo Rodrigues Oliveira</td>
                        <td>05/03/25</td>
                        <td>
                            <div className={profissionaisStyles.acessoPERITO}>
                                <p>Perito</p>
                            </div>
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
