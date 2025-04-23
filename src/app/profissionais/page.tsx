"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import casosStyles from "../styles/Home.module.css";
import profissionaisStyles from "../styles/Profissionais.module.css";
import Link from "next/link";
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
import { useEffect, useState } from "react";
// import { validarSenhas } from "../services/validacaoServices";
import { createUser } from "../services/saveServices";

// import {useState} from "react";

interface User {
  id: string;
  name: string;
  role: string;
}

export default function Profissionais() {
    // const name [name, setName] = useState("");
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [password, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [name,setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("ADMIN");

//   const handleSalvar = () => {
//     const resultado = validarSenhas(password);

//     if (!resultado.valido) {
//       alert("⚠️ " + resultado.mensagem);
//       return;
//     }

//     alert("✅ " + resultado.mensagem);
//     // Aqui você segue com a lógica de salvar no backend
//   };

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
  fetchUsuarios()
}, [])


const createUsers = async () => {
  if (!name || !email || !password || !role) {
    alert("⚠️ Preencha todos os campos obrigatórios");
    return;
  }

  try {
    const usuario = await createUser(name, email, password, role); // <- await

    alert("✅ Usuário salvo com sucesso!");
    console.log(usuario);
    fetchUsuarios();
  } catch (error) {
    alert(`❌ Erro: ${error.message}`);
  }
}



  return (
    <div className={casosStyles.container}>
      {/*--------SIDEBAR ESQUERDA--------------------------*/}
      <aside className={casosStyles.sidebar}>
        {/* <div className={casosStyles.logo}>Laudos Periciais Odonto-Legal</div> */}
        <div>
          <div></div>

          <div className={casosStyles.logo}>
            <Image
              src={`/imagens/Logo - Laudo.png`}
              alt="Logo - Laudo"
              width={60}
              height={60}
            ></Image>
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
              {/* <Image  src={`/imagens/User.png`} alt="pacientes" width={35} height={35}></Image> */}
              <Link href={`/pacientes`} className={casosStyles.link}>
                Pacientes
              </Link>
            </div>

            <div className={casosStyles.icone}>
              <LuFileUser className={casosStyles.iconeInterno} />
              {/* <Image  src={`/imagens/User.png`} alt="pacientes" width={30} height={30}></Image> */}
              <Link href={`/cadastros`} className={casosStyles.link}>
                Cadastros
              </Link>
            </div>

            <div className={casosStyles.icone}>
              <SiElectronbuilder className={casosStyles.iconeInterno} />
              {/* <Image  src={`/imagens/User.png`} alt="pacientes" width={30} height={30}></Image> */}
              <Link href={`profissionais`} className={casosStyles.link}>
                Profissionais
              </Link>
            </div>

            <div className={casosStyles.icone}>
              <BiSolidUserBadge className={casosStyles.iconeInterno} />
              {/* <Image  src={`/imagens/User.png`} alt="pacientes" width={30} height={30}></Image> */}
              <Link href={`/casos`} className={casosStyles.link}>
                Casos
              </Link>
            </div>

            <div className={casosStyles.icone}>
              <TbFileSearch className={casosStyles.iconeInterno} />
              {/* <Image  src={`/imagens/User.png`} alt="pacientes" width={30} height={30}></Image> */}
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
          <h1>Profissionais</h1>

          {/*-------------PESQUISAR POR CASOS---------------*/}

          <h2>Pesquisar</h2>
          <input
            type="search"
            placeholder="Pesquisar por usuário"
            className={casosStyles.pesquisa}
          />

          <div className={casosStyles.conteudo}>
            <button className={casosStyles.botaoPesquisar}>🔍 Pesquisar</button>
          </div>
          {/*-------------CADASTRAR CASOS---------------*/}

          <div className={casosStyles.section}>
            {/*-------------TABELA DE CADASTRAR CASOS---------------*/}
            {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}
            <h2>Cadastrar profissionais</h2>

            <div className={casosStyles.cadastroCasos}>
              <div className={casosStyles.cadastroEsquerda}>
                <div className={casosStyles.organizacao}>
                  <label>
                    {" "}
                    Nome Completo <br />
                    <input
                      type="text"
                      placeholder="Digite o nome completo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>
                    {" "}
                    E-mail* <br />
                    <input type="email" 
                    value={email}
                    placeholder="Digite o email" required 
                    onChange={(e) => setEmail(e.target.value)}
                    
                    />
                    
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>
                    Senha: <br />
                    <input
                      type="password"
                      placeholder="Digite a password"
                      value={password}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>
                    Repita a Senha: <br />
                    <input
                      type="password"
                      placeholder="Digite a senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </div>

              <div className={casosStyles.cadastroDireita}>
                {/*---------EXEMPLOS----------*/}
                {/* <div className={casosStyles.organizacao}>
                  <label>
                    {" "}
                    Matricula* <br />
                    <input
                      type="number"
                      placeholder="Digite a matricula"
                      required
                    />
                  </label>
                </div> */}

                {/*---------EXEMPLOS----------*/}
                <div className={casosStyles.organizacao}>
                  <label>
                    Perfil de acesso: <br />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="ADMIN">ADMIN</option>
                      <option value="PERITO">PERITO</option>
                      <option value="ASSISTENTE">ASSISTENTE</option>
                    </select>
                  </label>
                </div>

                {/*---------EXEMPLOS----------*/}
                {/* <div className={casosStyles.organizacao}>
                  <label>
                    Data de Nascimento:
                    <input type="date" required />
                  </label>
                </div> */}

                <button onClick={createUsers}>Salvar</button>
              </div>
            </div>

            {/*-----------TODOS ESSES DADOS SÃO DE EXEMPLOS, OS VERDADEIROS TERÃO QUE VIM DO BACKEND*/}

            <h2>Todos os profissionais</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Nível de Acesso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}> {/* Supondo que cada usuário tem um id único */}
                  <td>{usuario.name}</td>
                  <td>{usuario.role}</td>
                  <td className={casosStyles.acoes}>
                    <button className={casosStyles.acaoBotao} title="Confirmar">✅</button>
                    <button className={casosStyles.acaoBotao} title="Editar">✏️</button>
                    <button className={casosStyles.acaoBotao} title="Excluir">❌</button>
                  </td>
                </tr>
              ))}
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
