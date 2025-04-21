
import redefinirSenha from "../styles/redefinirSenha.module.css";

export default function RecuperaSenha(){

    
    

    return (
        <div className={redefinirSenha.container}>
          <h1>Esqueceu a senha</h1>
          <form className={redefinirSenha.form}>
            <label>
              Email:
              <input
                type="password"
                placeholder="Digite seu email"
                required
              />
            </label>

    
            <button type="submit">Enviar para o email</button>
          </form>
        </div>
      );
}