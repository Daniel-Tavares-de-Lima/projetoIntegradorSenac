"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import casosStyles from "../styles/Home.module.css";
import Link from "next/link";
{
  /*-----Icones Side bar-----*/
}
import { FaRegUser } from "react-icons/fa6";
import { LuFileUser } from "react-icons/lu";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
import { useState, useEffect } from "react";
{
  /*-----Icones Side bar-----*/
}
// import {useState} from "react";
import { fetchCases, createCase } from "../services/casosService";

export default function Casos() {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    peritoResponsavel: "",
    status: "Em andamento",
  });

  // Estado para armazenar a lista de casos
  const [cases, setCases] = useState([]);
  const [error, setError] = useState(null); // Para exibir erros ao usuário
  const [loading, setLoading] = useState(false); // Para indicar o estado de salvamento

  // Função para buscar os casos do backend
  const loadCases = async () => {
    try {
      const data = await fetchCases();
      setCases(data);
      setError(null);
    } catch (error) {
      console.error("Erro ao buscar casos:", error.message);
      setError(error.message);
    }
  };

  // Carrega os casos ao montar o componente
  useEffect(() => {
    loadCases();
  }, []);

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para enviar o formulário ao backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Indica que o salvamento está em andamento
    try {
      const newCase = await createCase(formData); // Salva o caso no backend
      // Adiciona o novo caso diretamente à lista de casos no estado
      setCases((prevCases) => [...prevCases, newCase]);
      alert("Caso cadastrado com sucesso!");
      // Limpa o formulário
      setFormData({
        titulo: "",
        descricao: "",
        tipo: "",
        peritoResponsavel: "",
        status: "Em andamento",
      });
      setError(null);
    } catch (error) {
      console.error("Erro ao cadastrar caso:", error.message);
      setError(error.message);
    } finally {
      setLoading(false); // Finaliza o estado de loading
    }
  };

  return (
    <div className={casosStyles.container}>
      {/*--------SIDEBAR ESQUERDA--------------------------*/}
      <aside className={casosStyles.sidebar}>
        <div>
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

      <main className={casosStyles.main}>
        <header className={casosStyles.header}>
          <div className={casosStyles.logoApp}>
            Gest<span>Odo</span>
          </div>
          <input
            type="search"
            placeholder="Pesquisar casos ou pacientes"
            className={casosStyles.pesquisa}
          />
          <div className={casosStyles.user}>
            {" "}
            <FaRegUser /> Julia
          </div>
        </header>

        <section className={casosStyles.content}>
          <h1>Casos</h1>

          {error && <div className={casosStyles.errorMessage}>{error}</div>}

          <h2>Pesquisar</h2>
          <input
            type="search"
            placeholder="Pesquisar casos ou pacientes"
            className={casosStyles.pesquisa}
          />
          <div className={casosStyles.conteudo}>
            <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
          </div>

          <div className={casosStyles.section}>
            <h2>Cadastrar Casos</h2>
            <form onSubmit={handleSubmit} className={casosStyles.cadastroCasos}>
              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Título do Caso* <br />
                    <input
                      type="text"
                      name="titulo"
                      placeholder="Digite o título do caso"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Descrição* <br />
                    <textarea
                      name="descricao"
                      placeholder="Descreva os detalhes do caso"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
              </div>

              <div className={casosStyles.cadastroDireita}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Tipo de Caso: <br />
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione</option>
                      <option value="Acidente">Acidente</option>
                      <option value="Identificação">Identificação</option>
                      <option value="Exame Criminal">Exame Criminal</option>
                    </select>
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Perito Responsável: <br />
                    <input
                      type="text"
                      name="peritoResponsavel"
                      placeholder="Nome do perito"
                      value={formData.peritoResponsavel}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Status <br />
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Em andamento">Em andamento</option>
                      <option value="Finalizado">Finalizado</option>
                      <option value="Arquivado">Arquivado</option>
                    </select>
                  </label>
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>

            <h2>Todos os Casos</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
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
                {cases.length > 0 ? (
                  cases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td>{caseItem.id}</td>
                      <td>{caseItem.tipo || "N/A"}</td>
                      <td>{caseItem.solicitante || "N/A"}</td>
                      <td>{caseItem.peritoResponsavel || "N/A"}</td>
                      <td>
                        {caseItem.dataCriacao
                          ? new Date(caseItem.dataCriacao).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        N/A{" "}
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
                        <span
                          className={
                            casosStyles[
                              `status${(caseItem.status || "").replace(
                                " ",
                                ""
                              )}`
                            ] || casosStyles.statusEmAndamento
                          }
                        >
                          {caseItem.status || "Em andamento"}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">Nenhum caso encontrado.</td>
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
