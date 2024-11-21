'use client'

import Link from "next/link"
import "./globals.css"
import "./layout.css"
import { AccountIcon, BlockIcon, HomeIcon, StudentIcon } from "../Icons"
import { useState } from "react"
export function Menu(){
  const [page, setPage] = useState(null)
  return (
    <>
      <div className="menu grid-container">
        <div>BlockED</div>
        <Link href="/"><div className="menu-option flex-container"><HomeIcon/>Pagina Inicial</div></Link>
        <Link href="Alunos"><div className="menu-option flex-container"><StudentIcon/>Alunos</div></Link>
        <Link href="Alunos"><div className="menu-option flex-container"><BlockIcon/>Bloqueios</div></Link>
        <Link href="Alunos"><div className="menu-option flex-container"><AccountIcon/>Perfil</div></Link>
      </div>
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body >
        <div className={`main grid-container`} >
          <Menu/>
          
            {children}
 
        </div>       
      </body>
    </html>
  );
}
