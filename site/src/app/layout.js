'use client'
import { useRef } from "react"
import Link from "next/link"
import "./globals.css"
import "./layout.css"
import { AccountIcon, BlockIcon, HomeIcon, StudentIcon } from "../Icons"
import { useState } from "react"

function MenuOption({href='Home',children}){
  return <Link href={href}><div className="menu-option flex-container">{children}</div></Link>
}

export function Menu(){
  const homeRef = useRef(null)
  return (
    <>
      <div className="menu grid-container">
        <div>BlockED</div>

        <MenuOption href="/Home">
          <HomeIcon/> Pagina Inicial
        </MenuOption>

        <MenuOption>
          <StudentIcon/> Alunos
        </MenuOption>

        <MenuOption>
          <AccountIcon/> Perfil
        </MenuOption>

        <MenuOption>
          <BlockIcon/>Bloqueios
        </MenuOption>
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
