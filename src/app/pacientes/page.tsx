"use client";

import casosStyles from "../styles/Home.module.css";
import Image from "next/image";
import pacientesStyles from "../styles/Pacientes.module.css";
import evidenciasStyles from "../styles/Evidencias.module.css";
import Link from "next/link";
import { useState } from "react";
{
  /*-----Icones Side bar-----*/
}
import { FaRegUser } from "react-icons/fa6";
import { LuFileUser } from "react-icons/lu";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
{
  /*-----Icones Side bar-----*/
}

export default function Pacientes() {
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  const handleAdicionarPaciente = () => {
    setMostrarCadastro(true);
  };

  const handleVoltar = () => {
    setMostrarCadastro(false);
  };

  return (
    <div className={casosStyles.container}>
      {/*--------SIDEBAR ESQUERDA--------------------------*/}
      <aside className={casosStyles.sidebar}>
        {/* <div className={casosStyles.logo}>Laudos Periciais Odonto-Legal</div> */}
        <div className="logo">
          <div className="imagem"></div>

          <div className={casosStyles.logo}>
            <Image
              src={`/imagens/Logo - Laudo.png`}
              alt="Logo - Laudo"
              width={60}
              height={60}
            />
            <h1>
              <Link
                href={`http://localhost:3000`}
                className={casosStyles.titulo}
              >
                Laudos Periciais Odonto-Legal
              </Link>
            </h1>
          </div>

          <nav className={casosStyles.navi}>
            <div className={casosStyles.icone}>
              <FaRegUser className={casosStyles.iconeInterno} />
              <Link href={`/pacientes`} className={casosStyles.link}>
                Pacientes
              </Link>
            </div>
            <div className={casosStyles.icone}>
              <LuFileUser className={casosStyles.iconeInterno} />
              <Link href={`/cadastros`} className={casosStyles.link}>
                Cadastros
              </Link>
            </div>
            <div className={casosStyles.icone}>
              <SiElectronbuilder className={casosStyles.iconeInterno} />
              <Link href={`profissionais`} className={casosStyles.link}>
                Profissionais
              </Link>
            </div>
            <div className={casosStyles.icone}>
              <BiSolidUserBadge className={casosStyles.iconeInterno} />
              <Link href={`/casos`} className={casosStyles.link}>
                Casos
              </Link>
            </div>
            <div className={casosStyles.icone}>
              <TbFileSearch className={casosStyles.iconeInterno} />
              <Link href={`evidencias`} className={casosStyles.link}>
                Evidências
              </Link>
            </div>
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

          <input
            type="search"
            placeholder="Pesquisar casos ou pacientes"
            className={casosStyles.pesquisa}
          />

          {/*-----O usuário também tem que vim do backend----*/}
          <div className={casosStyles.user}>
            {" "}
            <FaRegUser /> Julia
          </div>
        </header>
        {/*--------------HEADER-----------------------*/}

        <section className={casosStyles.content}>
          {!mostrarCadastro ? (
            // Painel inicial
            <>
              <h1>Painel Inicial</h1>

              {/*-------------PESQUISAR POR PACIENTES---------------*/}
              <h2>Pesquisar</h2>

              <div className={pacientesStyles.filtroData}>
                <div className={pacientesStyles.dataField}>
                  <label>Data inicial</label>
                  <input
                    type="date"
                    placeholder="DD/MM/AAAA"
                    className={pacientesStyles.dataInput}
                  />
                </div>

                <div className={pacientesStyles.dataField}>
                  <label>Data final</label>
                  <input
                    type="date"
                    placeholder="DD/MM/AAAA"
                    className={pacientesStyles.dataInput}
                  />
                </div>
              </div>

              <input
                type="search"
                placeholder="Pesquisar casos, pacientes ou evidência"
                className={casosStyles.pesquisa}
              />

              <div className={casosStyles.conteudo}>
                <button className={casosStyles.botaoPesquisar}>
                  🔍 Pesquisar
                </button>
              </div>

              {/*-------------LISTA DE MAIS RECENTES---------------*/}
              <h2>Mais recentes</h2>

              <div className={pacientesStyles.botoesAcao}>
                <button
                  className={pacientesStyles.btnAdicionar}
                  onClick={handleAdicionarPaciente}
                >
                  <span>+</span> Adicionar paciente
                </button>
                <Link href="/casos">
                  <button className={pacientesStyles.btnRegistrar}>
                    <span>📝</span> Registrar caso
                  </button>
                </Link>
              </div>

              {/*-------------TABELA DE CASOS---------------*/}
              <h3>Casos</h3>
              <div className={casosStyles.section}>
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
                        02/22 11:25 AM Exame odontol...{" "}
                        <a href="#" className={casosStyles.verTudo}>
                          Ver Tudo
                        </a>
                      </td>
                      <td>
                        <button className={casosStyles.botaoExame}>
                          Solicitar Exame
                        </button>
                      </td>
                      <td>
                        <span className={pacientesStyles.statusEmAndamento}>
                          Em andamento
                        </span>
                      </td>
                      <td className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Confirmar"
                        >
                          ✅
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Excluir"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#021</td>
                      <td>Acidente</td>
                      <td>05/03/25 - 10:33</td>
                      <td>📍 Jaboatão - PE</td>
                      <td>Marcos Silva</td>
                      <td>Julia Maria</td>
                      <td>17/12/22 - 19:14hrs</td>
                      <td>
                        11/23 09:12 AM Análise de arcada...{" "}
                        <a href="#" className={casosStyles.verTudo}>
                          Ver Tudo
                        </a>
                      </td>
                      <td>
                        <button className={casosStyles.botaoExame}>
                          Solicitar Exame
                        </button>
                      </td>
                      <td>
                        <span className={pacientesStyles.statusArquivado}>
                          Arquivado
                        </span>
                      </td>
                      <td className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Confirmar"
                        >
                          ✅
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Excluir"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={pacientesStyles.verMais}>
                  <button>
                    Ver Mais <span>▼</span>
                  </button>
                </div>
              </div>

              {/*-------------TABELA DE PACIENTES---------------*/}
              <h3>Pacientes</h3>
              <div className={casosStyles.section}>
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Sexo</th>
                      <th>Data de Nascimento</th>
                      <th>Solicitante da perícia</th>
                      <th>Data do Exame</th>
                      <th>Últimos Exames</th>
                      <th>Solicitar Exames</th>
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
                      <td>
                        02/22 11:25 AM Exame odontol...{" "}
                        <a href="#" className={casosStyles.verTudo}>
                          Ver Tudo
                        </a>
                      </td>
                      <td>
                        <button className={casosStyles.botaoExame}>
                          Solicitar Exame
                        </button>
                      </td>
                      <td className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Confirmar"
                        >
                          ✅
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Excluir"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#021</td>
                      <td>José Gomes Carvalho</td>
                      <td>Masculino</td>
                      <td>30/08/1997</td>
                      <td>Marcos Silva</td>
                      <td>10/01/22 - 11:43hrs</td>
                      <td>
                        11/23 09:12 AM Análise de arcada...{" "}
                        <a href="#" className={casosStyles.verTudo}>
                          Ver Tudo
                        </a>
                      </td>
                      <td>
                        <button className={casosStyles.botaoExame}>
                          Solicitar Exame
                        </button>
                      </td>
                      <td className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Confirmar"
                        >
                          ✅
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Excluir"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={pacientesStyles.verMais}>
                  <button>
                    Ver Mais <span>▼</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Página de cadastro de pacientes atualizada
            <>
              <div className={pacientesStyles.headerCadastro}>
                <button
                  className={pacientesStyles.btnVoltar}
                  onClick={handleVoltar}
                >
                  <span>←</span> Voltar
                </button>
                <h1>Cadastrar Paciente</h1>
              </div>

              <div className={casosStyles.section}>
                <form
                  className={casosStyles.cadastroCasos}
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className={casosStyles.cadastroEsquerda}>
                    <div className={casosStyles.organizacao}>
                      <label>
                        {" "}
                        Nome: <br />
                        <input
                          type="text"
                          placeholder="Digite o nome completo"
                          required
                        />
                      </label>
                    </div>

                    <div className={casosStyles.organizacao}>
                      <label>
                        {" "}
                        Data de Nascimento: <br />
                        <input type="date" />
                      </label>
                    </div>
                  </div>

                  <div className={casosStyles.cadastroDireita}>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Sexo: <br />
                        <select required>
                          <option value="">Selecione</option>
                          <option value="feminino">Feminino</option>
                          <option value="masculino">Masculino</option>
                          <option value="outro">Outro</option>
                        </select>
                      </label>
                    </div>

                    <div className={casosStyles.organizacao}>
                      <label>
                        Identificado: <br />
                        <select required>
                          <option value="">Selecione</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                      </label>
                    </div>

                    <button className={evidenciasStyles.btnSalvar}>
                      Salvar
                    </button>
                  </div>
                </form>
              </div>

              {/* Tabela de pacientes existentes */}
              <h3>Todos os Pacientes</h3>
              <div className={casosStyles.section}>
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Sexo</th>
                      <th>Data de Nascimento</th>
                      <th>Identificado</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#022</td>
                      <td>Ana Maria da Silva</td>
                      <td>Feminino</td>
                      <td>12/02/2001</td>
                      <td>Sim</td>
                      <td className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Confirmar"
                        >
                          ✅
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Excluir"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#021</td>
                      <td>José Gomes Carvalho</td>
                      <td>Masculino</td>
                      <td>30/08/1997</td>
                      <td>Sim</td>
                      <td className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Confirmar"
                        >
                          ✅
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Excluir"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>#020</td>
                      <td>Desconhecido</td>
                      <td>Masculino</td>
                      <td>--/--/----</td>
                      <td>Não</td>
                      <td className={casosStyles.acoes}>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Confirmar"
                        >
                          ✅
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className={casosStyles.acaoBotao}
                          title="Excluir"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className={pacientesStyles.verMais}>
                  <button>
                    Ver Mais <span>▼</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
