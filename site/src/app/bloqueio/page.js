"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import Header from "@components/Header.js";



export default function Bloqueios(){
  const [menuActual, setMenuActual] = useState("outros");
  const [diretorios, setDiretorios] = useState("");
  function BloqueioItem(props){
    return(
      <div className={props.menu == menuActual ? "bloqueioItem bloqueioItemFocused" : "bloqueioItem"} onClick={() => {setMenuActual(props.menu)}}>
        <img src={props.src} />
        <span>{props.text}</span>
       </div>
    );
  }
   function Site(props){
     return(
       <div className="site">
          <img src="/img/internet.svg"/>
          <span>{props.domain}</span>
          <img src="/img/trash.svg"/>
        </div>
     );
   }
    function Aplicativo(props){
     return(
       <div className="app">
          <img src="/img/android.svg"/>
          <span>{props.name}</span>
          <img src="/img/trash.svg"/>
        </div>
     );
   }

  function MenuOutros(){
    return(
      <div className="menuItem">
	empty
      </div>
    );
  }
   function CloseMenu(){
     return(
       <nav className="closeButton" onClick={() => {setMenuActual(null); setDiretorios("")}}>
         <img src="/img/close.svg"/>
       </nav >
     );
   }
  return(
    <>
    <div id="main">
      <div id="mainHeader">
        <BloqueioItem src="/img/android.svg" text="Aplicativos" menu="aplicativos"/>
        <BloqueioItem src="/img/internet.svg" text="Sites" menu="sites"/>
        <BloqueioItem src="/img/more.svg" text="Outros"  menu="outros"/>
      </div>
      <div id="mainContent">
      	{/* menuActual == "aplicativos" && */}
      	{/* menuActual == "sites"*/}
      	{ menuActual == "outros" && <MenuOutros />}
      </div>
    </div>
    </>
    );
}
