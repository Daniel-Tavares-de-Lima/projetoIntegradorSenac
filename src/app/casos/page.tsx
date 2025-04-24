"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import casosStyles from "../styles/Home.module.css";
import Link from "next/link";
import {createCase} from "../services/casosService";
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
// import {useState} from "react";
// import { apiRequest } from "../services/apiServices";
import { useState, useEffect } from "react";



interface Caso {
  id: string;
  title: string;
  description: string;
  classification: string;
  statusCase: string;
  managerId: string;
  manager?: { name: string };
  dateOpened: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export default function Casos() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  // const [users, setUsers] = useState<User[]>([]);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classification: "",
    peritoResponsavel: "",
    statusCase: "ANDAMENTO",
    solicitante: "",
  });
  // const [name,setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Buscar casos
  const fetchCasos = async () => {
    try {
      const response = await fetch("https://pi3p.onrender.com/cases", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })  //.then(res => res.json());
      
      const data = await response.json();


      if(Array.isArray(data)){
        console.log("Casos retornados:", data);

        setCasos(data);
      }else {
        console.error("Resposta inesperada da API de casos:", data);
        setError("Erro ao carregar casos. Formato inválido.");

      }
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Buscar usuários
  // const fetchUsers = async () => {
  //   try {
  //     const response = await fetch("https://pi3p.onrender.com/users", {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });  //.then(res => res.json());
      
  //     const data = await response.json();

  //     if(Array.isArray(data)){
  //       console.log("Usuários retornados:", data);

  //       setUsers(data);
  //     }else{
  //       console.error("Resposta inesperada da API de usuários:", data);
  //       setError("Erro ao carregar usuários. Formato inválido.");
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };


  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      alert("Usuário não autenticado. Faça login novamente.")
      return;
    }
  
    try {
      const response = await fetch("https://pi3p.onrender.com/users", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar usuários')
      }
  
      setUsuarios(data)
    } catch (error) {
      console.error(error.message);
      alert("Erro ao buscar usuários");
    }
  };

  useEffect(() => {
    fetchCasos();
    fetchUsuarios();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.classification || !formData.peritoResponsavel) {
      setError("⚠️ Preencha todos os campos obrigatórios");
      return;
    }
    try {
      const novoCaso = await createCase(
        formData.title,
        formData.description,
        formData.classification,
        formData.peritoResponsavel
      );
      setCasos((prev) => [...prev, novoCaso]);
      setFormData({
        title: "",
        description: "",
        classification: "",
        peritoResponsavel: "",
        statusCase: "ANDAMENTO",
        solicitante: "",
      });
      setError(null);
      alert("✅ Caso salvo com sucesso!");
    } catch (err) {
      setError(err.message);
      alert(`❌ Erro: ${err.message}`);
    }
  };

  return (
    <div className={casosStyles.container}>
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
              <Link href={`http://localhost:3000`} className={casosStyles.titulo}>
                Laudos Periciais Odonto-Legal
              </Link>
            </h1>
          </div>
          <nav className={casosStyles.navi}>
            <div className={casosStyles.icone}>
              <FaRegUser className={casosStyles.iconeInterno} />
              <Link href={`/pacientes`} className={casosStyles.link}>Pacientes</Link>
            </div>
            <div className={casosStyles.icone}>
              <LuFileUser className={casosStyles.iconeInterno} />
              <Link href={`/cadastros`} className={casosStyles.link}>Cadastros</Link>
            </div>
            <div className={casosStyles.icone}>
              <SiElectronbuilder className={casosStyles.iconeInterno} />
              <Link href={`/profissionais`} className={casosStyles.link}>Profissionais</Link>
            </div>
            <div className={casosStyles.icone}>
              <BiSolidUserBadge className={casosStyles.iconeInterno} />
              <Link href={`/casos`} className={casosStyles.link}>Casos</Link>
            </div>
            <div className={casosStyles.icone}>
              <TbFileSearch className={casosStyles.iconeInterno} />
              <Link href={`/evidencias`} className={casosStyles.link}>Evidências</Link>
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
            <FaRegUser /> Julia
          </div>
        </header>

        <section className={casosStyles.content}>
          <h1>Casos</h1>
          {error && <p className={casosStyles.error}>{error}</p>}

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
                      name="title"
                      placeholder="Digite o título do caso"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Descrição* <br />
                    <textarea
                      name="description"
                      placeholder="Descreva os detalhes do caso"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Solicitante da Perícia <br />
                    <input
                      type="text"
                      name="solicitante"
                      placeholder="Nome do solicitante"
                      value={formData.solicitante}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
              </div>

              <div className={casosStyles.cadastroDireita}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Tipo de Caso* <br />
                    <select
                      name="classification"
                      value={formData.classification}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="CRIMINAL">Exame Criminal</option>
                      <option value="ACIDENTE">Acidente</option>
                      <option value="IDENTIFICACAO">Identificação</option>
                    </select>
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Perito Responsável* <br />
                    <select
                      name="peritoResponsavel"
                      value={formData.peritoResponsavel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {usuarios
                        .filter(user => user.role === "PERITO")
                        .map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                        
                    </select>
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Status* <br />
                    <select
                      name="statusCase"
                      value={formData.statusCase}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="ANDAMENTO">Em andamento</option>
                      <option value="FINALIZADO">Finalizado</option>
                      <option value="ARQUIVADO">Arquivado</option>
                    </select>
                  </label>
                </div>
                <button type="submit" className={casosStyles.botaoSalvar}>
                  Salvar
                </button>
              </div>
            </form>

            <h2>Todos os Casos</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Titulo</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Data do Fato</th>
                  {/* <th>Local</th> */}
                  <th>Solicitante da Perícia</th>
                  <th>Responsável</th>
                  {/* <th>Data do Exame</th> */}
                  {/* <th>Últimos Exames</th> */}
                  {/* <th>Solicitar Exames</th> */}
                  <th>Status</th>
                  <th>Solicitar Exames</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso) => (
                  <tr key={caso.id}>
                    <td>{caso.id.slice(0, 4)}</td>
                    <td>{caso.title}</td>
                    <td>{caso.description}</td>
                    <td>{caso.classification}</td>
                    <td>{new Date(caso.dateOpened).toLocaleString()}</td>
                    <td>{formData.solicitante || '-'}</td>
                    <td>{caso.manager?.name || '-'}</td>
                    <td>
                      <span className={casosStyles[`status${caso.statusCase}`]}>
                        {caso.statusCase}
                      </span>
                    </td>
                
                    <td>
                      <button className={casosStyles.botaoExame}>Solicitar Exame</button>
                    </td>
                    
                    <td className={casosStyles.acoes}>
                      <button className={casosStyles.acaoBotao} title="Confirmar">✅</button>
                      <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
                      <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}