import { AuthProvider } from "@/context/AuthContext";
import { AlertProvider } from "@/context/AlertContext";
import "./globals.css";

export const metadata = {
  title: "Início | BlockED",
  description: "Site para bloqueio de Recursos inadequados"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider> 
          <AlertProvider>
            {children}
          </AlertProvider> 
        </AuthProvider>
      </body>
    </html>
  );
}
