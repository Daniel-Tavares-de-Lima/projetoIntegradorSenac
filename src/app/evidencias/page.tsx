"use client";

import casosStyles from "../styles/Home.module.css";
import evidenciasStyles from "../styles/Evidencias.module.css";
import Link from "next/link";

export default function Evidencias() {
    return (
        <div className={casosStyles.container}>
            {/*--------SIDEBAR ESQUERDA--------------------------*/}
            <aside className={casosStyles.sidebar}>
                <div className="logo">
                    <div className="imagem" />
                    <div className="titulo">
                        <h1>Laudos Periciais Odonto-Legal</h1>
                    </div>

                    <nav className={casosStyles.navi}>
                        <Link href={`/pacientes`} className={casosStyles.link}>Pacientes</Link>
                        <Link href={`/cadastro`} className={casosStyles.link}>Cadastros</Link>
                        <Link href={`/profissionais`} className={casosStyles.link}>Profissionais</Link>
                        <Link href={`/casos`} className={casosStyles.link}>Casos</Link>
                        <Link href={`/evidencias`} className={casosStyles.link}>Evidências</Link>
                    </nav>
                </div>
                <div className={casosStyles.config}>⚙️ Configurações</div>
            </aside>

            {/*--------CONTEÚDO PRINCIPAL--------------------------*/}
            <main className={casosStyles.main}>
                <header className={casosStyles.header}>
                    <div className={casosStyles.logoApp}>
                        Gest<span>Odo</span>
                    </div>

                    <input type="search" placeholder="Pesquisar casos ou pacientes" className={casosStyles.pesquisa} />

                    <div className={casosStyles.user}>👤 Julia</div>
                </header>

                <section className={casosStyles.content}>
                    <h1>Evidências</h1>

                    {/*-------------PESQUISAR EVIDÊNCIAS---------------*/}
                    <h2>Pesquisar</h2>
                    <input type="search" placeholder="Pesquisar evidência" className={casosStyles.pesquisa} />

                    <div className={casosStyles.conteudo}>
                        <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
                    </div>

                    {/*-------------CADASTRAR EVIDÊNCIAS---------------*/}
                    <h2>Cadastrar</h2>

                    <div className={casosStyles.section}>
                        <div className={casosStyles.cadastroCasos}>
                            <div className={casosStyles.cadastroEsquerda}>
                                <div className={casosStyles.organizacao}>
                                    <label> Nome: <br />
                                        <input type="text" placeholder="Digite o nome completo" required />
                                    </label>
                                </div>

                                <div className={casosStyles.organizacao}>
                                    <label> Email: <br />
                                        <input type="email" placeholder="Digite o email" required />
                                    </label>
                                </div>

                                <div className={casosStyles.organizacao}>
                                    <label> Senha: <br />
                                        <input type="password" placeholder="Digite a senha" required />
                                    </label>
                                </div>
                            </div>

                            <div className={casosStyles.cadastroDireita}>
                                <div className={casosStyles.organizacao}>
                                    <label> Data de Nascimento: <br />
                                        <input type="date" required />
                                    </label>
                                </div>

                                <div className={casosStyles.organizacao}>
                                    <label>Sexo: <br />
                                        <select required>
                                            <option value="">Selecione</option>
                                            <option value="feminino">Feminino</option>
                                            <option value="masculino">Masculino</option>
                                        </select>
                                    </label>
                                </div>

                                <div className={casosStyles.organizacao}>
                                    <label>Nível de Acesso: <br />
                                        <select required>
                                            <option value="">Selecione</option>
                                            <option value="perito">Perito</option>
                                            <option value="administrador">Administrador</option>
                                        </select>
                                    </label>
                                </div>

                                <button className={evidenciasStyles.btnSalvar}>Salvar</button>
                            </div>
                        </div>
                    </div>

                    {/*-------------TODOS OS USUÁRIOS---------------*/}
                    <h2>Todos os usuários</h2>
                    <div className={casosStyles.section}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Matrícula</th>
                                    <th>Nome</th>
                                    <th>Sexo</th>
                                    <th>Data de Nascimento</th>
                                    <th>Nível de Acesso</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="check-012358" />
                                        <label htmlFor="check-012358">012358</label>
                                    </td>
                                    <td>Julia Gomes Santana</td>
                                    <td>Feminino</td>
                                    <td>12/02/1990</td>
                                    <td>
                                        <span className={evidenciasStyles.nivelAdministrador}>Administrador</span>
                                    </td>
                                    <td className={casosStyles.acoes}>
                                        <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
                                        <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="check-015489" />
                                        <label htmlFor="check-015489">015489</label>
                                    </td>
                                    <td>Marcelo Rodrigues Oliveira</td>
                                    <td>Masculino</td>
                                    <td>30/08/1997</td>
                                    <td>
                                        <span className={evidenciasStyles.nivelPerito}>Perito</span>
                                    </td>
                                    <td className={casosStyles.acoes}>
                                        <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
                                        <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
