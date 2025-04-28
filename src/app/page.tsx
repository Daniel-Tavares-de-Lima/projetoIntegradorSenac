'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './services/authServiceLogin';
import loginStyles from './styles/login.module.css';

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
      router.push('http://localhost:3000/home'); // Redireciona para a página de profissionais
    } catch (err) {
      setErro(getErrorMessage(err));
    }
  };

  return (
    <div className={loginStyles.container}>
      <form onSubmit={handleSubmit} className={loginStyles.form}>
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