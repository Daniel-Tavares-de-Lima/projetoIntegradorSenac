"use client";

import casosStyles from "../styles/Home.module.css";
import evidenciasStyles from "../styles/Evidencias.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaRegUser } from "react-icons/fa6";
import { LuFileUser } from "react-icons/lu";
import { SiElectronbuilder } from "react-icons/si";
import { BiSolidUserBadge } from "react-icons/bi";
import { TbFileSearch } from "react-icons/tb";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import React from "react";



export default function Evidencias() {
    const [file, setFile] = useState<File | null>(null);
    const [evidencias, setEvidencias] = useState<any[]>([]); // Armazena evidências cadastradas
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleUpload = () => {
      if (!file) {
        alert("Selecione um arquivo primeiro.");
        return;
      }
  
      // Simula envio para a API para cadastro da evidência
      const newEvidence = {
        id: Math.random().toString(36).substr(2, 9), // Simula um ID único
        type: file.type.startsWith("image") ? "IMAGE" : "TEXT", // Define tipo da evidência
        dateCollection: new Date(),
        status: "ATIVADO",
        collectedBy: "Usuário Teste", // Substituir com usuário autenticado
        case: "Caso Teste", // Substituir com caso real
        imageEvidence: file.type.startsWith("image") ? { imageURL: URL.createObjectURL(file) } : null,
        textEvidence: file.type.startsWith("text") ? { content: "Conteúdo do texto" } : null
      };
  
      setEvidencias([...evidencias, newEvidence]); // Adiciona a nova evidência à lista
      alert("Upload realizado com sucesso!");
    };
  
    const handleGeneratePDF = () => {
      const doc = new jsPDF();
      doc.text("Relatório de Evidências", 10, 10);
      doc.text("Data: " + new Date().toLocaleString(), 10, 20);
  
      // Adiciona detalhes das evidências no PDF
      evidencias.forEach((evidence, index) => {
        doc.text(`Evidência ${index + 1}:`, 10, 30 + (index * 10));
        doc.text(`Tipo: ${evidence.type}`, 10, 40 + (index * 10));
        doc.text(`Data de Coleta: ${evidence.dateCollection.toLocaleString()}`, 10, 50 + (index * 10));
        doc.text(`Status: ${evidence.status}`, 10, 60 + (index * 10));
  
        if (evidence.type === "IMAGE" && evidence.imageEvidence) {
          doc.addImage(evidence.imageEvidence.imageURL, "JPEG", 10, 70 + (index * 10), 50, 50); // Adiciona imagem ao PDF
        }
      });
  
      doc.save("relatorio_evidencias.pdf");
    };
  

  return (
    <div className={casosStyles.container}>
      <aside className={casosStyles.sidebar}>
        <div>
          <div />
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
            <div className={casosStyles.icone}><FaRegUser className={casosStyles.iconeInterno} /><Link href={`/pacientes`} className={casosStyles.link}>Pacientes</Link></div>
            <div className={casosStyles.icone}><LuFileUser className={casosStyles.iconeInterno} /><Link href={`/cadastros`} className={casosStyles.link}>Cadastros</Link></div>
            <div className={casosStyles.icone}><SiElectronbuilder className={casosStyles.iconeInterno} /><Link href={`profissionais`} className={casosStyles.link}>Profissionais</Link></div>
            <div className={casosStyles.icone}><BiSolidUserBadge className={casosStyles.iconeInterno} /><Link href={`/casos`} className={casosStyles.link}>Casos</Link></div>
            <div className={casosStyles.icone}><TbFileSearch className={casosStyles.iconeInterno} /><Link href={`evidencias`} className={casosStyles.link}>Evidências</Link></div>
          </nav>
        </div>
        <div className={casosStyles.config}>⚙️ Configurações</div>
      </aside>

      <main className={casosStyles.main}>
        <header className={casosStyles.header}>
          <div className={casosStyles.logoApp}>Gest<span>Odo</span></div>
          <input type="search" placeholder="Pesquisar casos ou pacientes" className={casosStyles.pesquisa} />
          <div className={casosStyles.user}><FaRegUser /> Julia</div>
        </header>

        <section className={casosStyles.content}>
          <h1>Evidências</h1>


            {/*-------------PESQUISAR EVIDÊNCIAS---------------*/}
          <h2>Pesquisar</h2>
          <input
            type="search"
            placeholder="Pesquisar evidência"
            className={casosStyles.pesquisa}
          />

          <div className={casosStyles.conteudo}>
            <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
          </div>

          {/*-------------CADASTRAR EVIDÊNCIAS---------------*/}
          <h2>Cadastrar</h2>

          <div className={casosStyles.section}>
            <div className={casosStyles.cadastroCasos}>
              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                <label>
                Tipo de Evidência: <br />
                <select required>
                  <option value="IMAGE">Imagem</option>
                  <option value="TEXT">Texto</option>
                </select>
              </label>
                </div>

                <div className={casosStyles.organizacao}>
                <label>
                Data de Coleta: <br />
                <input type="date" required />
              </label>
                </div>

                <div className={casosStyles.organizacao}>
                  <label>
                    {" "}
                    Coletado por: <br />
                    <input
                      type="text"
                      placeholder="Nome do coletor"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className={casosStyles.cadastroDireita}>
                <div className={casosStyles.organizacao}>
                <label>
                Caso: <br />
                <input type="text" placeholder="Caso associado" required />
              </label>
                </div>

                <div className={casosStyles.organizacao}>
                 {/* Upload de Arquivo */}
          <h3>Upload de Evidência</h3>
          <div className={casosStyles.section}>
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className={evidenciasStyles.uploadInput}
            />
            <button onClick={handleUpload} className={evidenciasStyles.btnSalvar}>
               Enviar Evidência
            </button>
          </div>
                </div>

                {/* <div className={casosStyles.organizacao}>
                  <label>
                    Nível de Acesso: <br />
                    <select required>
                      <option value="">Selecione</option>
                      <option value="perito">Perito</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </label>
                </div> */}

                {/* <button className={evidenciasStyles.btnSalvar}>Salvar</button> */}
              </div>
            </div>
          </div>

          {/* Exibir evidências cadastradas */}
          <h2>Evidências Cadastradas</h2>
          <div className={casosStyles.section}>
            <table>
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
                {evidencias.map((evidence, index) => (
                  <tr key={evidence.id}>
                    <td>{evidence.type}</td>
                    <td>{new Date(evidence.dateCollection).toLocaleDateString()}</td>
                    <td>{evidence.status}</td>
                    <td>{evidence.collectedBy}</td>
                    <td>
                      <button className={casosStyles.acaoBotao} title="Visualizar">
                        👁️
                      </button>
                      <button className={casosStyles.acaoBotao} title="Excluir">
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        

          {/* Geração de PDF */}
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
