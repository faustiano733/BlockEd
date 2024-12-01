"use client";
import "@styles/Menu.css";
import Link from "next/link";
import {usePathname} from "next/navigation";
export default function Menu(){
  const pathname = usePathname();
  function MenuItem(props){
    return(
        <Link href={props.href} className={(props.href == pathname ? "menu_item menu_item_focused" : "menu_item")}>
          <img src={props.src}/>
          <span>{props.text}</span>
        </Link>
    )
  }
  return(
    <div className="menu">
      <div className="menuHeader">
	<span>BlockEd</span>
      </div>
      <div className="menuContent">
	<MenuItem href="/" text="Início" src="/img/home4.svg"/>
	<MenuItem href="/perfil" text="Perfil" src="/img/user_setting.svg"/>
	<MenuItem href="/bloqueio" text="Bloqueio" src="/img/locker.svg"/>
	<MenuItem href="/alunos" text="Alunos" src="/img/profile.svg"/>
      </div>
    </div>
  )
}
