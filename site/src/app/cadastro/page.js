
"use client";
import "./cadastro.css";
import "../styles/cadastro.css";
import { useState } from "react"; 



export default function Home() {
  // Estado para o passo atual
  const [currentStep, setCurrentStep] = useState(1);

  // Lista de passos
  const steps = [1, 2, 3, 4];

  // Conteúdo específico de cada passo
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="Agrup">
          <div className="input-container">
            <h1> Credenciais de acesso</h1>
            <label htmlFor="text">username</label>
            <input type="text" id="text" placeholder="Digite seu username" />

            <label htmlFor="email">Email Institucional</label>
            <input type="email" id="email" placeholder="Digite seu email" />
             
             <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="Digite sua senha" />

            <label htmlFor="password">Confirme Senha</label>
            <input type="password" id="password" placeholder="Digite sua senha" />
          </div>
          {currentStep < steps.length && (
                <button type="button"onClick={() => setCurrentStep((prev) => prev + 1)} className="pxm" >
                  Próximo
                </button>
              )}
          </div>
        );
      case 2:
        return (
          <div className="Agrup">
          <div className="input-container">
            <h1>Informações da escola</h1>
             <label htmlFor="text">Nome da escola</label>
             <input type="text" id="text" placeholder="Digite seu username" />
             <label htmlFor="text">Nome da escola</label>
             <input type="text" id="text" placeholder="Digite seu username" />
             </div>
          {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep((prev) => prev - 1)} className="vlt">
                  Voltar
                </button>
              )}
              {currentStep < steps.length && (
                <button type="button"onClick={() => setCurrentStep((prev) => prev + 1)} className="pxm">
                  Próximo
                </button>
              )}
          </div>
          
        );
      case 3:
        return (
        <div>
        <h3>Revisão dos dados (exemplo para passo 3)</h3>;
        {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep((prev) => prev - 1)} className="vlt">
                  Voltar
                </button>
              )}
              {currentStep < steps.length && (
                <button type="button"onClick={() => setCurrentStep((prev) => prev + 1)} className="pxm">
                  Próximo
                </button>
              )}
        </div>
      
      );

      case 4:
        return (
        <div>
    <h3>Aceitação dos termos de uso e política de privacidade 
    !</h3>;
    {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep((prev) => prev - 1)} className="vlt">
                  Voltar
                </button>
              )}
            {currentStep === steps.length && (
                <button type="submit" className="fnl">Finalizar</button>
              )}
    </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="layout">
      <div className="barracima">
        <div className="steps-org">
          {steps.map((step) => (
            <div
              key={step}
              className={`step ${currentStep === step ? "active" : ""}`}
              onClick={() => setCurrentStep(step)} // Clique para alterar o passo
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="main">
        <div className="esquerda">
          <h1>
            Blocked
          </h1>
        {renderStepContent()}

         {/* <form className="passo">
            <h2>Blocked
              Passo {currentStep} de {steps.length}

            </h2>
            {renderStepContent()}

            {/* Botões para navegação 
            <div className="login-button">
              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep((prev) => prev - 1)}>
                  Voltar
                </button>
              )}
              {currentStep < steps.length && (
                <button type="button"onClick={() => setCurrentStep((prev) => prev + 1)}>
                  Próximo
                </button>
              )}
              
            </div>
          </form>*/}

        </div>
      </div>
    </div>
  );
}

