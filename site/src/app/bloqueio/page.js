"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import Header from "@components/Header.js";



export default function Bloqueios(){
  const [menuActual, setMenuActual] = useState(null);
  const [diretorios, setDiretorios] = useState("");
  function BloqueioItem(props){
    return(
      <div className="bloqueioItem" onClick={() => {setMenuActual(props.menu); setDiretorios("/"+props.menu)}}>
        <img src={props.src} />
        {props.text}
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
   function CloseMenu(){
     return(
       <nav className="closeButton" onClick={() => {setMenuActual(null); setDiretorios("")}}>
         <img src="/img/close.svg"/>
       </nav >
     );
   }
  return(
    <>
    <Header />
    <NavigationRoute diretorios={diretorios}/>
    <div id="main" style={(menuActual ? {filter: "blur(1px) brightness(0.5)"} : {})}>
      <BloqueioItem src="/img/android.svg" text="Aplicativos" menu="aplicativos"/>
      <BloqueioItem src="/img/internet.svg" text="Sites" menu="sites"/>
      <BloqueioItem src="/img/more1.svg" text="Outros"  menu="outros"/>
      
    </div>
    <div id="menuSites" className="menuItem" style={( menuActual == "sites" ? {display: "flex"} : {})}>
        <section>
	<CloseMenu />
	<nav className="linha_horizontal"></nav>
        <Site domain="www.facebook.com"/>
        <nav className="linha_horizontal"></nav>
        <Site domain="www.tiktok.com"/>
        <nav className="linha_horizontal"></nav>
        <div className="add_more">
          <img src="/img/more5.svg" />
        </div>
        <nav className="linha_horizontal"></nav>
        </section>
     </div>
     <div id="menuAplicativos" className="menuItem" style={( menuActual == "aplicativos" ? {display: "flex"} : {})}>
        <section>
	<CloseMenu />
	<nav className="linha_horizontal"></nav>
        <Aplicativo name="Facebook"/>
        <nav className="linha_horizontal"></nav>
        <Aplicativo name="TikTok"/>
        <nav className="linha_horizontal"></nav>
        <div className="add_more">
          <img src="/img/more5.svg" />
        </div>
        <nav className="linha_horizontal"></nav>
        </section>
     </div>
      <div id="menuOutros" className="menuItem" style={( menuActual == "outros" ? {display: "flex"} : {})}>
        <section>
        <CloseMenu />
        <nav className="linha_horizontal"></nav>        
        <div>
          <img src="/img/camera.svg" />
          <span>Câmera</span>
          <input type="checkbox" />
        </div>
        <nav className="linha_horizontal"></nav>
        <div>
	  <img src="/img/internet.svg" />
          <span>Internet</span>
          <input type="checkbox" />
        </div>
        <nav className="linha_horizontal"></nav>
        </section>
      </div>
    </>
    );
}
