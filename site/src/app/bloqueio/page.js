"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import Header from "@components/Header.js";



export default function Bloqueios(){
  const [menuActual, setMenuActual] = useState("aplicativos");
  const [subMenu, setSubMenu] = useState(null);
  const [diretorios, setDiretorios] = useState("");
  const [sites, setSites] = useState([{domain: "facebook.com"}, {domain: "tiktok.com"}]);
  const [apps, setApps] = useState([{name: "Facebook"}, {name: "TikTok"}]);
  
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  function BloqueioItem(props){
    return(
      <div className={props.menu == menuActual ? "bloqueioItem bloqueioItemFocused" : "bloqueioItem"} onClick={() => {setMenuActual(props.menu); setSubMenu(null)}}>
        <img src={props.src} />
        <span>{props.text}</span>
       </div>
    );
  }
  function EmptyMenu({text}){
    return(
      <section className="emptyMenu">
	{ text }
      </section>
    );
  }
  function Add(props){
    return(
	<img className="add" src="/img/add2.svg" onClick={props.onClick && props.onClick}/>
    );
  }
    

 
  function MenuAplicativos(){
/*    if(apps.length < 1) return <EmptyMenu text="Nenhum aplicativo adicionado" />*/
    return(
      <div className="menuItem" id="menuAplicativos">
	{apps.length < 1 && <EmptyMenu text="Nenhum aplicativo adicionado" />}
        {apps.map((elemento, index)=>{
	  return <Aplicativo key={index} name={elemento.name} loaded={true} />
        }
        )}
	<Add onClick={()=>{setSubMenu("adicionarAplicativos")}}/>
      </div>
    );
  }

  function Aplicativo(props){
    const [appLoading, setAppLoading] = useState(false);
    const [appAccepted, setAppAccepted] = useState(false);

    async function addApp(nomeDaApp){
      await sleep(1000);
      setAppLoading(false);
      setAppAccepted(true);
  }
    if(props.loaded) return(
      <div className="app">
         <img src="/img/android.svg"/>
         <span>{props.name}</span>
         <img src="/img/delete.svg"/>
       </div>
    );
    else return(
      <div className="app">
         <img src="/img/android.svg"/>
         <span>{props.name}</span>
         <img src={(appLoading) ? "/img/pending.svg" : (appAccepted) ? "/img/check.svg" : "/img/add.svg"} onClick={()=>{if(!appAccepted){setAppLoading(true); addApp(props.name)}}}/>
      </div>
    );
  }
  function AdicionarAplicativos(){
    const [searchAppLoading, setSearchAppLoading] = useState(false);
    const [searchedApps, setSearchedApps] = useState([]);
    async function searchApp(){
      await sleep(1000);
      setSearchAppLoading(false);
      setSearchedApps([{name: "Whatsapp"}, {name: "Instagram"}])
    }
    return(
      <div className="menuItem" id="adicionarAplicativos">
	<div>
	  <input type="text" placeholder="Insira o nome do aplicativo"/>
	  <img src={searchAppLoading ? "/img/pending.svg" : "/img/search.svg"} onClick={()=>{setSearchAppLoading(true); searchApp()}}/>
	</div>
	<small>Resultados</small>
	<section>
	  {(searchedApps.length < 1) && <EmptyMenu text="Nenhum app encontrado"/>}
          {searchedApps.map((elemento, index)=>{
	    return <Aplicativo key={index} name={elemento.name} />
          })}
        </section>
      </div>
    );
  }


  function MenuSites(){
    return(
      <div className="menuItem" id="menuSites">
        {sites.length < 1 && <EmptyMenu text="Nenhum site adicionado" /> }
	{sites.map((elemento, index)=>{
          return <Site key={index} domain={elemento.domain} />        }
        )}
	<Add onClick={()=>{setSubMenu("adicionarSites")}}/>
      </div>
    );
  }
  function Site(props){
     return(
       <div className="site">
          <img src="/img/internet.svg"/>
          <span>{props.domain}</span>
          <img src="/img/delete.svg"/>
        </div>
     );
  }

  function AdicionarSites(){
    const [searchSiteLoading, setSearchSiteLoading] = useState(false);
    const [searchedSiteData, setSearchedSiteData] = useState(null);
    //const [searchedApps, setSearchedApps] = useState([]);
    async function searchSite(){
      await sleep(1000);
      setSearchSiteLoading(false);
      setSearchedSiteData({status: 200, domain: "Twitter.com", added: false, allowed: true});
      //setSearchedApps([{name: "Whatsapp"}, {name: "Instagram"}])
    }
    return(
      <div className="menuItem" id="adicionarSites">
	<div>
	  <input type="text" placeholder="Insira o domínio do site"/>
	  <img src={searchSiteLoading ? "/img/pending.svg" : "/img/search.svg"} onClick={()=>{setSearchSiteLoading(true); searchSite()}}/>
	</div>
	{ searchedSiteData && <> 
	{/*<small>Resultados</small>*/}
	<section>
	  <span>Status: {searchedSiteData.status}</span>
	  <span>Domínio: {searchedSiteData.domain}</span>
	  <span>Já adicionado: {searchedSiteData.added ? "Sim" : "Não"}</span>
	  <span>Elegível: {searchedSiteData.allowed ? "Sim" : "Não"}</span>
	  {/*<span></span>
	  <span></span>
	  <span></span>*/}
        </section>
	<div className={searchedSiteData.allowed ? "addSiteButton" : "addSiteButton buttonDisabled"}> Adicionar site <img src="/img/add.svg"/></div>
        </>}
      </div>
    );
  }

  function MenuOutros(){
    return(
      <div className="menuItem" id="menuOutros">
	<MenuOutrosServico img="site.svg" text="Internet" />
	<MenuOutrosServico img="camera.svg" text="Câmera" />
	<MenuOutrosServico img="sound.svg" text="Silencioso" />
      </div>
    );
  }

  function MenuOutrosServico(props){
    return(
      <div>
        <img src={"/img/"+props.img} />
        <span>{props.text}</span>
        <input type="checkbox" />
      </div>
    )
  }
   function CloseMenu(){
     return(
       <nav className="closeButton" onClick={() => {setMenuActual(null); setDiretorios("")}}>
         <img src="/img/close.svg"/>
       </nav >
     );
   }
   function MainContent(){
     	if(subMenu == "adicionarAplicativos") return <AdicionarAplicativos />
     	if(subMenu == "adicionarSites") return <AdicionarSites />
      	if(menuActual == "aplicativos") return <MenuAplicativos />
      	if(menuActual == "sites") return <MenuSites />
      	if(menuActual == "outros") return <MenuOutros />
   }
  return(
    <>
    <div id="main">
      <div id="mainContent">
	<MainContent />
      </div>
      <div id="mainFooter">
        <BloqueioItem src="/img/android.svg" text="Aplicativos" menu="aplicativos"/>
        <BloqueioItem src="/img/internet.svg" text="Sites" menu="sites"/>
        <BloqueioItem src="/img/more.svg" text="Outros"  menu="outros"/>
      </div>
    </div>
    </>
    );
}
