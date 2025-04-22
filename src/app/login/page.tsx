'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../services/authServiceLogin'; // importa a função
import loginStyles from '../styles/login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await login(email, password); // utiliza a função importada
      router.push('/'); // redireciona após login
    } catch (err) {
      setErro(err.message);
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
