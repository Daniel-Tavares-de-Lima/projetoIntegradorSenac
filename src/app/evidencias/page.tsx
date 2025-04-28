"use client";

import casosStyles from "../styles/Home.module.css";
import evidenciasStyles from "../styles/Evidencias.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa6";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import { createEvidence, updateEvidence, deleteEvidence, fetchEvidences, fetchCases } from "../services/evidenceServices";
import { getUserInfo } from "../services/infoUserServices";

interface Evidence {
  id: string;
  type: "IMAGE" | "TEXT";
  dateCollection: string;
  status: "ATIVADO" | "DESATIVADO";
  collectedById: string;
  caseId: string;
  imageEvidence?: { imageURL: string };
  textEvidence?: { content: string };
}

interface Case {
  id: string;
  title: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export default function Evidencias() {
  const [file, setFile] = useState<File | null>(null);
  const [evidencias, setEvidencias] = useState<Evidence[]>([]);
  const [casos, setCasos] = useState<Case[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Novo estado para armazenar usuários
  const [formData, setFormData] = useState({
    type: "IMAGE" as "IMAGE" | "TEXT",
    dateCollection: "",
    collectedById: "", // Alterado para collectedById
    caseId: "",
    content: "",
  });
  const [editEvidenceId, setEditEvidenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Usuário");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para buscar usuários
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("⚠️ Usuário não autenticado. Faça login novamente.");
      return;
    }
    try {
      const response = await fetch("https://pi3p.onrender.com/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar usuários");
      }
      setUsers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para buscar evidências
  const fetchEvidencias = async () => {
    try {
      const data = await fetchEvidences();
      setEvidencias(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
      setEvidencias([]);
    }
  };

  // Função para buscar casos
  const fetchCasos = async () => {
    try {
      const data = await fetchCases();
      setCasos(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message);
      setCasos([]);
    }
  };

  useEffect(() => {
    // Obtém as informações do usuário usando getUserInfo
    const userInfo = getUserInfo();
    console.log("Informações do usuário:", userInfo);
    if (!userInfo) {
      setError("⚠️ Não foi possível obter informações do usuário. Faça login novamente.");
      window.location.href = "/login";
      return;
    }

    // Define o nome e o role do usuário
    setUserName(userInfo.name || "Usuário Desconhecido");
    setCurrentUserRole(userInfo.role || "UNKNOWN");

    fetchEvidencias();
    fetchCasos();
    fetchUsers(); // Buscar usuários ao carregar a página
  }, []);

  // Função para mapear collectedById para o nome do usuário
  const getCollectorName = (collectedById: string) => {
    const user = users.find((u) => u.id === collectedById);
    return user ? user.name : "-";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.dateCollection || !formData.collectedById || !formData.caseId) {
      setError("⚠️ Preencha todos os campos obrigatórios");
      return;
    }
    if (formData.type === "IMAGE" && !file) {
      setError("⚠️ Selecione uma imagem para evidência do tipo IMAGE");
      return;
    }
    if (formData.type === "TEXT" && !formData.content) {
      setError("⚠️ Insira o conteúdo para evidência do tipo TEXT");
      return;
    }

    try {
      let imageURL: string | undefined;
      if (formData.type === "IMAGE" && file) {
        // Converter imagem para base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        imageURL = await base64Promise;
      }

      if (editEvidenceId) {
        // Modo de edição
        await updateEvidence(
          editEvidenceId,
          formData.type,
          formData.dateCollection,
          formData.caseId,
          formData.type === "IMAGE" ? imageURL : undefined,
          formData.type === "TEXT" ? formData.content : undefined
        );
        alert("✅ Evidência atualizada com sucesso!");
        setEditEvidenceId(null);
      } else {
        // Modo de criação
        await createEvidence(
          formData.type,
          formData.dateCollection,
          formData.caseId,
          formData.type === "IMAGE" ? imageURL : undefined,
          formData.type === "TEXT" ? formData.content : undefined
        );
        alert("✅ Evidência salva com sucesso!");
      }

      // Limpar formulário
      setFormData({
        type: "IMAGE",
        dateCollection: "",
        collectedById: "",
        caseId: "",
        content: "",
      });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setError(null);
      fetchEvidencias();
    } catch (error) {
      setError(`❌ Erro: ${error.message}`);
    }
  };

  const handleEdit = (evidence: Evidence) => {
    setEditEvidenceId(evidence.id);
    setFormData({
      type: evidence.type,
      dateCollection: new Date(evidence.dateCollection).toISOString().split("T")[0],
      collectedById: evidence.collectedById,
      caseId: evidence.caseId,
      content: evidence.textEvidence?.content || "",
    });
    setFile(null); // Limpar arquivo, usuário pode selecionar nova imagem
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja desativar esta evidência?")) return;
    try {
      await deleteEvidence(id);
      alert("✅ Evidência desativada com sucesso!");
      fetchEvidencias();
    } catch (error) {
      setError(`❌ Erro: ${error.message}`);
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Evidências", 10, 10);
    doc.text(`Data: ${new Date().toLocaleString()}`, 10, 20);

    let yOffset = 30;
    evidencias.forEach((evidence, index) => {
      doc.text(`Evidência ${index + 1}:`, 10, yOffset);
      doc.text(`Tipo: ${evidence.type}`, 10, yOffset + 10);
      doc.text(`Data de Coleta: ${new Date(evidence.dateCollection).toLocaleString()}`, 10, yOffset + 20);
      doc.text(`Status: ${evidence.status}`, 10, yOffset + 30);
      doc.text(`Coletado Por: ${getCollectorName(evidence.collectedById)}`, 10, yOffset + 40);
      doc.text(`Caso: ${casos.find((c) => c.id === evidence.caseId)?.title || "-"}`, 10, yOffset + 50);

      if (evidence.type === "TEXT" && evidence.textEvidence?.content) {
        doc.text(`Conteúdo: ${evidence.textEvidence.content.substring(0, 50)}...`, 10, yOffset + 60);
        yOffset += 80;
      } else if (evidence.type === "IMAGE" && evidence.imageEvidence?.imageURL) {
        try {
          doc.addImage(evidence.imageEvidence.imageURL, "JPEG", 10, yOffset + 60, 50, 50);
          yOffset += 120;
        } catch (error) {
          doc.text("Imagem não pôde ser carregada", 10, yOffset + 60);
          yOffset += 80;
        }
      } else {
        yOffset += 80;
      }
    });

    doc.save("relatorio_evidencias.pdf");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={casosStyles.container}>
      <button className={casosStyles.hamburger} onClick={toggleSidebar}>
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      <aside className={`${casosStyles.sidebar} ${isSidebarOpen ? casosStyles.open : ""}`}>
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
          <div className={casosStyles.logoApp}>Gest<span>Odo</span></div>
          <input type="search" placeholder="Pesquisar casos ou pacientes" className={casosStyles.pesquisa} />
          <div className={casosStyles.user}>
            <FaRegUser /> {userName}
          </div>
        </header>

        <section className={casosStyles.content}>
          <h1>Evidências</h1>
          {error && <p className={casosStyles.error}>{error}</p>}

          <h2>Pesquisar</h2>
          <input type="search" placeholder="Pesquisar evidência" className={casosStyles.pesquisa} />
          <div className={casosStyles.conteudo}>
            <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
          </div>

          <h2>{editEvidenceId ? "Editar Evidência" : "Cadastrar Evidência"}</h2>
          <div className={casosStyles.section}>
            <form className={casosStyles.cadastroCasos} onSubmit={handleUpload}>
              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                  <label>
                    Tipo de Evidência: <br />
                    <select name="type" value={formData.type} onChange={handleInputChange} required>
                      <option value="IMAGE">Imagem</option>
                      <option value="TEXT">Texto</option>
                    </select>
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Data de Coleta: <br />
                    <input
                      type="date"
                      name="dateCollection"
                      value={formData.dateCollection}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <div className={casosStyles.organizacao}>
                  <label>
                    Coletado por: <br />
                    <select
                      name="collectedById"
                      value={formData.collectedById}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className={casosStyles.cadastroDireita}>
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
                {formData.type === "TEXT" && (
                  <div className={casosStyles.organizacao}>
                    <label>
                      Conteúdo: <br />
                      <textarea
                        name="content"
                        placeholder="Digite o conteúdo da evidência"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>
                )}
                {formData.type === "IMAGE" && (
                  <div className={casosStyles.organizacao}>
                    <h3>Upload de Evidência</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className={evidenciasStyles.uploadInput}
                    />
                  </div>
                )}
                <button type="submit" className={evidenciasStyles.btnSalvar}>
                  {editEvidenceId ? "Salvar Alterações" : "Enviar Evidência"}
                </button>
                {editEvidenceId && (
                  <button
                    type="button"
                    className={evidenciasStyles.btnSalvar}
                    onClick={() => {
                      setEditEvidenceId(null);
                      setFormData({
                        type: "IMAGE",
                        dateCollection: "",
                        collectedById: "",
                        caseId: "",
                        content: "",
                      });
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      setError(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <h2>Evidências Cadastradas</h2>
          <div className={casosStyles.section}>
            <table className={evidenciasStyles.evidenciasTable}>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Data de Coleta</th>
                  <th>Status</th>
                  <th>Coletado Por</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {evidencias.length > 0 ? (
                  evidencias.map((evidence) => (
                    <tr key={evidence.id}>
                      <td data-label="Tipo">{evidence.type}</td>
                      <td data-label="Data de Coleta">{new Date(evidence.dateCollection).toLocaleDateString()}</td>
                      <td data-label="Status">{evidence.status}</td>
                      <td data-label="Coletado Por">{getCollectorName(evidence.collectedById)}</td>
                      <td data-label="Ações" className={casosStyles.acoes}>
                        {currentUserRole === "ADMIN" || currentUserRole === "PERITO" ? (
                          <>
                            <button
                              className={casosStyles.acaoBotao}
                              title="Visualizar"
                              onClick={() => alert("Funcionalidade de visualização não implementada")}
                            >
                              👁️
                            </button>
                            <button
                              className={casosStyles.acaoBotao}
                              title="Editar"
                              onClick={() => handleEdit(evidence)}
                            >
                              ✏️
                            </button>
                            <button
                              className={casosStyles.acaoBotao}
                              title="Excluir"
                              onClick={() => handleDelete(evidence.id)}
                            >
                              ❌
                            </button>
                          </>
                        ) : (
                          <span>Sem permissões</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Nenhuma evidência disponível</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2>Gerar PDF</h2>
          <div className={casosStyles.section}>
            <button onClick={handleGeneratePDF} className={evidenciasStyles.btnSalvar}>
              🧾 Gerar PDF
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}