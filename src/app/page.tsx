'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './services/authServiceLogin';
import loginStyles from './styles/login.module.css';
import Image from 'next/image'; // Importa o componente de imagem do Next.js

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();
  
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Erro desconhecido";
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const userData = await login(email, password);
      console.log("Dados do usuário após login:", userData);
      router.push('/home');
    } catch (err) {
      setErro(getErrorMessage(err));
    }
  };

  return (
    <div className={loginStyles.container}>
      <form onSubmit={handleSubmit} className={loginStyles.form}>
        {/* Aqui colocamos a logo centralizada */}
        <div className={loginStyles.logoContainer}>
          <Image src={`/imagens/logo12.png`} alt="Logo do Projeto" width={80} height={100} />

          
        </div>

        <h1>Entrar</h1>

        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>

        <label>
          Senha:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
