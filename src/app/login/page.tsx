'use client'
import loginStyles from '../styles/login.module.css';

export default function LoginPage() {
  return (
    <div className={loginStyles.container}>
      <form className={loginStyles.form}>
        <h1>Entrar</h1>

        <label>
          Email:
          <input type="email" placeholder="Digite seu email" required />
        </label>

        <label>
          Matrícula:
          <input type="text" placeholder="Digite sua matrícula" required />
        </label>

        <label>
          Senha:
          <input type="password" placeholder="Digite sua senha" required />
        </label>

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
