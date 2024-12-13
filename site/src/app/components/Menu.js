"use client";
import "@styles/Menu.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BlockIcon, StudentsIcon, ProfileIcon } from "../../Icons.jsx";
export default function Menu(){
  const pathname = usePathname();
  function MenuItem(props){
    return(
        <Link href={props.href} className={(props.href == pathname ? "menu_item menu_item_focused" : "menu_item")}>
          {props.icon}
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
	<MenuItem href="/" text="Início" src="/img/home.svg" icon={<HomeIcon />}/>
	<MenuItem href="/perfil" text="Perfil" src="/img/profile.svg" icon={<ProfileIcon />}/>
	<MenuItem href="/bloqueio" text="Bloqueio" src="/img/lock.svg" icon={<BlockIcon />}/>
	<MenuItem href="/alunos" text="Alunos" src="/img/alunos.svg" icon={<StudentsIcon />}/>
      </div>
    </div>
  )
}
