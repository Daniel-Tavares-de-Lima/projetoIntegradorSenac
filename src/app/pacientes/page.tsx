"use client";

import casosStyles from "../styles/Home.module.css";
import Image from "next/image";
import pacientesStyles from "../styles/Pacientes.module.css";
import evidenciasStyles from "../styles/Evidencias.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
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

import { createPatient, updatePatient, deletePatient, fetchPatients, fetchCases } from "../services/patientServices";

interface Patient {
  id: string;
  name: string;
  sex: string;
  birthDate?: string;
  identified: "YES" | "NO";
  caseId: string;
  status: "ATIVADO" | "DESATIVADO";
}

interface Case {
  id: string;
  title: string;
  description: string;
  classification: string;
  statusCase: string;
  managerId: string;
  solicitante?: string;
  dateOpened: string;
}


export default function Pacientes() {
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Patient[]>([]); // Lista filtrada
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [casos, setCasos] = useState<Case[]>([]);
  const [userName, setUserName] = useState(""); // Nome do usuário logado
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    birthDate: "",
    caseId: "",
    identified: "YES",
  });
  const [editPatientId, setEditPatientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Buscar nome do usuário logado
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }
      const storedName = localStorage.getItem("userName");
      if (storedName) {
        setUserName(storedName);
        return;
      }
      const response = await fetch("https://pi3p.onrender.com/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar usuário");
      }
      const name = data.name || data.username || data.fullName || "Usuário";
      setUserName(name);
      localStorage.setItem("userName", name);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error.message);
      setUserName("Usuário");
    }
  };

  const fetchPacientes = async () => {
    try {
      const data = await fetchPatients();
      const pacientesArray = Array.isArray(data) ? data : [];
      setPacientes(pacientesArray);
      setFilteredPacientes(pacientesArray); // Inicializar lista filtrada
    } catch (error) {
      setError(error.message);
      setPacientes([]);
      setFilteredPacientes([]);
    }
  };

  const fetchCasos = async () => {
    try {
      const data = await fetchCases();
      setCasos(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
      setCasos([]);
    }
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch("https://pi3p.onrender.com/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUserRole(data.role);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário logado:", error);
    }
  };

  // Função de pesquisa
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredPacientes(pacientes); // Mostrar todos se o termo estiver vazio
      return;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = pacientes.filter((paciente) => {
      const solicitante = getCaseSolicitante(paciente.caseId);
      return (
        paciente.name.toLowerCase().includes(lowerTerm) ||
        (solicitante !== "-" && solicitante.toLowerCase().includes(lowerTerm))
      );
    });
    setFilteredPacientes(filtered);
  };

  useEffect(() => {
    fetchUserData();
    fetchPacientes();
    fetchCasos();
    fetchCurrentUser();
  }, []);

  const handleAdicionarPaciente = () => {
    setMostrarCadastro(true);
  };

  const handleVoltar = () => {
    setMostrarCadastro(false);
    setEditPatientId(null);
    setFormData({
      name: "",
      sex: "",
      birthDate: "",
      caseId: "",
      identified: "YES",
    });
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const savePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sex || !formData.caseId || !formData.identified) {
      setError("⚠️ Preencha todos os campos obrigatórios");
      return;
    }
    if (formData.identified === "YES" && (!formData.name || !formData.birthDate)) {
      setError("⚠️ Nome e data de nascimento são obrigatórios para pacientes identificados");
      return;
    }

    try {
      if (editPatientId) {
        await updatePatient(
          editPatientId,
          formData.identified === "YES" ? formData.name : "Anônimo",
          formData.sex,
          formData.identified === "YES" ? formData.birthDate : null,
          formData.caseId,
          formData.identified
        );
        alert("✅ Paciente atualizado com sucesso!");
        setEditPatientId(null);
      } else {
        await createPatient(
          formData.identified === "YES" ? formData.name : "Anônimo",
          formData.sex,
          formData.identified === "YES" ? formData.birthDate : null,
          formData.caseId,
          formData.identified
        );
        alert("✅ Paciente salvo com sucesso!");
      }
      setFormData({
        name: "",
        sex: "",
        birthDate: "",
        caseId: "",
        identified: "YES",
      });
      setError(null);
      setMostrarCadastro(false);
      fetchPacientes();
    } catch (error) {
      setError(`❌ Erro: ${error.message}`);
    }
  };

  const handleEdit = (paciente: Patient) => {
    setEditPatientId(paciente.id);
    setFormData({
      name: paciente.name !== "Anônimo" ? paciente.name : "",
      sex: paciente.sex,
      birthDate: paciente.birthDate || "",
      caseId: paciente.caseId,
      identified: paciente.identified,
    });
    setMostrarCadastro(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar este paciente?")) return;
    try {
      await deletePatient(id);
      alert("✅ Paciente desativado com sucesso!");
      fetchPacientes();
    } catch (error) {
      setError(`❌ Erro: ${error.message}`);
    }
  };

  const getCaseSolicitante = (caseId: string) => {
    const caso = casos.find((c) => c.id === caseId);
    return caso ? caso.solicitante || "-" : "-";
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
            {/* <div className={casosStyles.icone}>
              <LuFileUser className={casosStyles.iconeInterno} />
              <Link href={`/cadastros`} className={casosStyles.link}>Cadastros</Link>
            </div> */}
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
            placeholder="Pesquisar por paciente"
            className={casosStyles.pesquisa}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className={casosStyles.user}>
            <FaRegUser /> {userName}
          </div>
        </header>

        <section className={casosStyles.content}>
          {error && <p className={casosStyles.error}>{error}</p>}
          {!mostrarCadastro ? (
            <>
              <h1>Painel Inicial</h1>
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
                placeholder="Pesquisar por paciente"
                className={casosStyles.pesquisa}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className={casosStyles.conteudo}>
                <button
                  className={casosStyles.botaoPesquisar}
                  onClick={() => handleSearch(searchTerm)}
                >
                  🔍 Pesquisar
                </button>
              </div>

              <h2>Mais recentes</h2>
              <div className={pacientesStyles.botoesAcao}>
                <button className={pacientesStyles.btnAdicionar} onClick={handleAdicionarPaciente}>
                  <span>+</span> Adicionar paciente
                </button>
                <Link href="/casos">
                  <button className={pacientesStyles.btnRegistrar}>
                    <span>📝</span> Registrar caso
                  </button>
                </Link>
              </div>

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
                    {filteredPacientes.length > 0 ? (
                      filteredPacientes.map((paciente) => (
                        <tr key={paciente.id}>
                          <td>{paciente.id.slice(0, 4)}</td>
                          <td>{paciente.name}</td>
                          <td>{paciente.sex}</td>
                          <td>{paciente.birthDate ? new Date(paciente.birthDate).toLocaleDateString() : "-"}</td>
                          <td>{getCaseSolicitante(paciente.caseId)}</td>
                          <td>-</td>
                          <td>-</td>
                          <td>
                            <button className={casosStyles.botaoExame}>Solicitar Exame</button>
                          </td>
                          <td className={casosStyles.acoes}>
                            {currentUserRole === "ADMIN" || currentUserRole === "PERITO" ? (
                              <>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Editar"
                                  onClick={() => handleEdit(paciente)}
                                >
                                  ✏️
                                </button>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Excluir"
                                  onClick={() => handleDelete(paciente.id)}
                                >
                                  ❌
                                </button>
                              </>
                            ) : (
                              <span>
                                <>
                                  <button
                                    className={casosStyles.acaoBotao}
                                    title="Editar"
                                    onClick={() => handleEdit(paciente)}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className={casosStyles.acaoBotao}
                                    title="Excluir"
                                    onClick={() => handleDelete(paciente.id)}
                                  >
                                    ❌
                                  </button>
                                </>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9}>Nenhum paciente encontrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className={pacientesStyles.verMais}>
                  <button>
                    Ver Mais <span>▼</span>
                  </button>
                </div>
              </div>

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
                    {casos.length > 0 ? (
                      casos.map((caso) => (
                        <tr key={caso.id}>
                          <td>{caso.id.slice(0, 4)}</td>
                          <td>{caso.classification}</td>
                          <td>{new Date(caso.dateOpened).toLocaleString()}</td>
                          <td>-</td>
                          <td>{caso.solicitante || "-"}</td>
                          <td>-</td>
                          <td>-</td>
                          <td>
                            <button className={casosStyles.botaoExame}>Solicitar Exame</button>
                          </td>
                          <td>
                            <span className={pacientesStyles[`status${caso.statusCase}`]}>
                              {caso.statusCase}
                            </span>
                          </td>
                          <td className={casosStyles.acoes}>
                            <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
                            <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={11}>Nenhum caso disponível</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className={pacientesStyles.verMais}>
                  {/* <button>
                    Ver Mais <span>▼</span>
                  </button> */}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={pacientesStyles.headerCadastro}>
                <button className={pacientesStyles.btnVoltar} onClick={handleVoltar}>
                  <span>←</span> Voltar
                </button>
                <h1>{editPatientId ? "Editar Paciente" : "Cadastrar Paciente"}</h1>
              </div>
              <div className={casosStyles.section}>
                <form className={casosStyles.cadastroCasos} onSubmit={savePatient}>
                  <div className={casosStyles.cadastroEsquerda}>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Nome: <br />
                        <input
                          type="text"
                          name="name"
                          placeholder="Digite o nome completo"
                          value={formData.name}
                          onChange={handleInputChange}
                          required={formData.identified === "YES"}
                          disabled={formData.identified === "NO"}
                        />
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Data de Nascimento: <br />
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          required={formData.identified === "YES"}
                          disabled={formData.identified === "NO"}
                        />
                      </label>
                    </div>
                  </div>
                  <div className={casosStyles.cadastroDireita}>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Sexo: <br />
                        <select name="sex" value={formData.sex} onChange={handleInputChange} required>
                          <option value="">Selecione</option>
                          <option value="FEMININO">Feminino</option>
                          <option value="MASCULINO">Masculino</option>
                          <option value="OUTRO">Outro</option>
                        </select>
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Identificado: <br />
                        <select name="identified" value={formData.identified} onChange={handleInputChange} required>
                          <option value="YES">Sim</option>
                          <option value="NO">Não</option>
                        </select>
                      </label>
                    </div>
                    <div className={casosStyles.organizacao}>
                      <label>
                        Caso: <br />
                        <select name="caseId" value={formData.caseId} onChange={handleInputChange} required>
                          <option value="">Selecione</option>
                          {casos.map((caso) => (
                            <option key={caso.id} value={caso.id}>
                              {caso.title}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <button type="submit" className={evidenciasStyles.btnSalvar}>
                      {editPatientId ? "Salvar Alterações" : "Salvar"}
                    </button>
                    {editPatientId && (
                      <button
                        type="button"
                        className={evidenciasStyles.btnSalvar}
                        onClick={handleVoltar}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
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
                    {filteredPacientes.length > 0 ? (
                      filteredPacientes.map((paciente) => (
                        <tr key={paciente.id}>
                          <td>{paciente.id.slice(0, 4)}</td>
                          <td>{paciente.name}</td>
                          <td>{paciente.sex}</td>
                          <td>{paciente.birthDate ? new Date(paciente.birthDate).toLocaleDateString() : "-"}</td>
                          <td>{paciente.identified === "YES" ? "Sim" : "Não"}</td>
                          <td className={casosStyles.acoes}>
                            {currentUserRole === "ADMIN" || currentUserRole === "PERITO" ? (
                              <>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Editar"
                                  onClick={() => handleEdit(paciente)}
                                >
                                  ✏️
                                </button>
                                <button
                                  className={casosStyles.acaoBotao}
                                  title="Excluir"
                                  onClick={() => handleDelete(paciente.id)}
                                >
                                  ❌
                                </button>
                              </>
                            ) : (
                              <span>
                                <>
                                  <button
                                    className={casosStyles.acaoBotao}
                                    title="Editar"
                                    onClick={() => handleEdit(paciente)}
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className={casosStyles.acaoBotao}
                                    title="Excluir"
                                    onClick={() => handleDelete(paciente.id)}
                                  >
                                    ❌
                                  </button>
                                </>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>Nenhum paciente encontrado</td>
                      </tr>
                    )}
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