// "use client";

// import Image from "next/image";
// // import styles from "./page.module.css";
// import casosStyles from "../styles/Home.module.css";
// import Link from "next/link";
// {
//   /*-----Icones Side bar-----*/
// }
// import { FaRegUser } from "react-icons/fa6";
// import { LuFileUser } from "react-icons/lu";
// import { SiElectronbuilder } from "react-icons/si";
// import { BiSolidUserBadge } from "react-icons/bi";
// import { TbFileSearch } from "react-icons/tb";
// {
//   /*-----Icones Side bar-----*/
// }
// // import {useState} from "react";
// import { apiRequest } from "../services/apiServices";
// import { useState } from "react";


// // Interface para tipar os casos
// interface Caso {
//   _id: string;
//   codigo?: string;
//   titulo: string;
//   descricao: string;
//   tipo: string;
//   peritoResponsavel: string;
//   solicitante: string;
//   status: string;
//   dataExame?: string;
//   ultimosExames?: string;
// }

// export default function Casos() {

//   // Estado para os casos
//   const [casos, setCasos] = useState<Caso[]>([]);

//   // Estado para os campos do formulário
//   const [formData, setFormData] = useState({
//     titulo: "",
//     descricao: "",
//     tipo: "",
//     peritoResponsavel: "",
//     status: "Em andamento",
//     solicitante: "", // Campo adicionado para Solicitante da Perícia
//   });

//   // Estado para mensagens de erro
//   const [error, setError] = useState<string | null>(null);

//   // Função para buscar casos do backend
//   const fetchCasos = async () => {
//     try {
//       const data = await apiRequest("/casos", "GET", null, true);
//       setCasos(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Carregar casos ao montar o componente
//   useEffect(() => {
//     fetchCasos();
//   }, []);

  
//   // Função para lidar com mudanças no formulário
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };


//   // Função para enviar o formulário
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const novoCaso = await apiRequest("/casos", "POST", formData, true);
//       setCasos((prev) => [...prev, novoCaso]);
//       setFormData({
//         titulo: "",
//         descricao: "",
//         tipo: "",
//         peritoResponsavel: "",
//         status: "Em andamento",
//         solicitante: "",
//       });
//       setError(null);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };


//   return (
//     <div className={casosStyles.container}>
//       {/*--------SIDEBAR ESQUERDA--------------------------*/}
//       <aside className={casosStyles.sidebar}>
//         <div>
//           <div className={casosStyles.logo}>
//             <Image
//               src={`/imagens/Logo - Laudo.png`}
//               alt="Logo - Laudo"
//               width={60}
//               height={60}
//             />
//             <h1>
//               <Link
//                 href={`http://localhost:3000`}
//                 className={casosStyles.titulo}
//               >
//                 Laudos Periciais Odonto-Legal
//               </Link>
//             </h1>
//           </div>

//           <nav className={casosStyles.navi}>
//             <div className={casosStyles.icone}>
//               <FaRegUser className={casosStyles.iconeInterno} />
//               <Link href={`/pacientes`} className={casosStyles.link}>
//                 Pacientes
//               </Link>
//             </div>
//             <div className={casosStyles.icone}>
//               <LuFileUser className={casosStyles.iconeInterno} />
//               <Link href={`/cadastros`} className={casosStyles.link}>
//                 Cadastros
//               </Link>
//             </div>
//             <div className={casosStyles.icone}>
//               <SiElectronbuilder className={casosStyles.iconeInterno} />
//               <Link href={`profissionais`} className={casosStyles.link}>
//                 Profissionais
//               </Link>
//             </div>
//             <div className={casosStyles.icone}>
//               <BiSolidUserBadge className={casosStyles.iconeInterno} />
//               <Link href={`/casos`} className={casosStyles.link}>
//                 Casos
//               </Link>
//             </div>
//             <div className={casosStyles.icone}>
//               <TbFileSearch className={casosStyles.iconeInterno} />
//               <Link href={`evidencias`} className={casosStyles.link}>
//                 Evidências
//               </Link>
//             </div>
//           </nav>
//         </div>
//         <div className={casosStyles.config}>⚙️ Configurações</div>
//       </aside>

//       <main className={casosStyles.main}>
//         <header className={casosStyles.header}>
//           <div className={casosStyles.logoApp}>
//             Gest<span>Odo</span>
//           </div>
//           <input
//             type="search"
//             placeholder="Pesquisar casos ou pacientes"
//             className={casosStyles.pesquisa}
//           />
//           <div className={casosStyles.user}>
//             {" "}
//             <FaRegUser /> Julia
//           </div>
//         </header>

//         <section className={casosStyles.content}>
//           <h1>Casos</h1>


//           {error && <p className={casosStyles.error}>{error}</p>}



//           <h2>Pesquisar</h2>
//           <input
//             type="search"
//             placeholder="Pesquisar casos ou pacientes"
//             className={casosStyles.pesquisa}
//           />
//           <div className={casosStyles.conteudo}>
//             <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
//           </div>

//           <div className={casosStyles.section}>
//             <h2>Cadastrar Casos</h2>
//             <form onSubmit={handleSubmit} className={casosStyles.cadastroCasos}>
//               <div className={casosStyles.cadastroEsquerda}>
//                 <div className={casosStyles.organizacao}>
//                   <label>
//                     Título do Caso* <br />
//                     <input
//                       type="text"
//                       name="titulo"
//                       placeholder="Digite o título do caso"
//                       value={formData.titulo}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </label>
//                 </div>
//                 <div className={casosStyles.organizacao}>
//                   <label>
//                     Descrição* <br />
//                     <textarea
//                       name="descricao"
//                       placeholder="Descreva os detalhes do caso"
//                       value={formData.descricao}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </label>
//                 </div>
//               </div>

//               <div className={casosStyles.cadastroDireita}>
//                 <div className={casosStyles.organizacao}>
//                   <label>
//                     Tipo de Caso: <br />
//                     <select
//                       name="tipo"
//                       value={formData.tipo}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Selecione</option>
//                       <option value="Acidente">Acidente</option>
//                       <option value="Identificação">Identificação</option>
//                       <option value="Exame Criminal">Exame Criminal</option>
//                     </select>
//                   </label>
//                 </div>
//                 <div className={casosStyles.organizacao}>
//                   <label>
//                     Perito Responsável: <br />
//                     <input
//                       type="text"
//                       name="peritoResponsavel"
//                       placeholder="Nome do perito"
//                       value={formData.peritoResponsavel}
//                       onChange={handleInputChange}
                      
//                     />
//                   </label>
//                 </div>
//                 <div className={casosStyles.organizacao}>
//                   <label>
//                     Status <br />
//                     <select
//                       name="status"
//                       value={formData.solicitante}
//                       onChange={handleInputChange}
                      
//                     >
//                       <option value="Em andamento">Em andamento</option>
//                       <option value="Finalizado">Finalizado</option>
//                       <option value="Arquivado">Arquivado</option>
//                     </select>
//                   </label>
//                 </div>
//                 <button type="submit" className={casosStyles.botaoSalvar}>
//                   Salvar
//                 </button>
//               </div>
//             </form>

//             <h2>Todos os Casos</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Código</th>
//                   <th>Tipo</th>
//                   <th>Data do Fato</th>
//                   <th>Local</th>
//                   <th>Solicitante da Perícia</th>
//                   <th>Responsável</th>
//                   <th>Data do Exame</th>
//                   <th>Últimos Exames</th>
//                   <th>Solicitar Exames</th>
//                   <th>Status</th>
//                   <th>Ações</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {casos.map((caso: Caso) => (
//                   <tr key={caso._id}> </tr>
//                   <tr key={caso.tipo}></tr>
//                 ) )}
//                 <tr>
//                   <td>#022</td>
//                   <td>Acidente</td>
//                   <td>12/03/25 - 12:43</td>
//                   <td>📍 Recife-PE</td>
//                   <td>Carlos Andrade</td>
//                   <td>Julia Maria</td>
//                   <td>14/02/23 - 12:03hrs</td>
//                   <td>
//                     02/22 11:25 AM Exame odontol...{" "}
//                     <a href="#" className={casosStyles.verTudo}>
//                       Ver Tudo
//                     </a>
//                   </td>
//                   <td>
//                     <button className={casosStyles.botaoExame}>
//                       Solicitar Exame
//                     </button>
//                   </td>
//                   <td>
//                     <span className={casosStyles.statusEmAndamento}>
//                       Em andamento
//                     </span>
//                   </td>
//                   <td className={casosStyles.acoes}>
//                     <button className={casosStyles.acaoBotao} title="Confirmar">
//                       ✅
//                     </button>
//                     <button className={casosStyles.acaoBotao} title="Editar">
//                       ✏️
//                     </button>
//                     <button className={casosStyles.acaoBotao} title="Excluir">
//                       ❌
//                     </button>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td>#021</td>
//                   <td>Acidente</td>
//                   <td>05/03/25 - 10:33</td>
//                   <td>📍 Jaboatão-PE</td>
//                   <td>Marcos Silva</td>
//                   <td>Julia Maria</td>
//                   <td>17/12/22 - 19:14hrs</td>
//                   <td>
//                     11/23 09:12 AM Análise de arcada...{" "}
//                     <a href="#" className={casosStyles.verTudo}>
//                       Ver Tudo
//                     </a>
//                   </td>
//                   <td>
//                     <button className={casosStyles.botaoExame}>
//                       Solicitar Exame
//                     </button>
//                   </td>
//                   <td>
//                     <span className={casosStyles.statusArquivado}>
//                       Arquivado
//                     </span>
//                   </td>
//                   <td className={casosStyles.acoes}>
//                     <button className={casosStyles.acaoBotao} title="Confirmar">
//                       ✅
//                     </button>
//                     <button className={casosStyles.acaoBotao} title="Editar">
//                       ✏️
//                     </button>
//                     <button className={casosStyles.acaoBotao} title="Excluir">
//                       ❌
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
