"use client";
import "./page.css";
import "../styles/page.css"; 


export default function Home() {
  return (
  <div className="pai">
 <div  className="main">
 <form className="login-form">
  <h2>Login</h2>    

  <div className="input-container">
  <label htmlFor="email">Email ou user adm</label>
  <input type="email" className="ipmail" />
   </div>

    <div className="input-container">
   <label htmlFor="password">Senha</label>
   <input type="password" className="ippass" />
    </div>

      <div className="login-button">
          <button type="submit">Entrar</button>
            </div>

        </form>
         
      </div>
    </div>
  );
}
