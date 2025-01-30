"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import { HorizontalLine, VerticalLine } from "@components/Lines.js";
import Header from "@components/Header.js";
import Input from "@components/Input.js";
import Button from "@components/Button.js";
import { AndroidIcon, SiteIcon, DeleteIcon, AddIcon, CheckIcon, PendingIcon, SearchIcon, InternetIcon, CameraIcon, SoundIcon, MoreIcon} from "../../Icons.jsx";
import { Metadata } from "next";

export function EmptyMenu({text}){
    return(
      <section className="emptyMenu">
	{ text }
      </section>
    );
  }

export default function Bloqueios(){
  const [menuActual, setMenuActual] = useState("aplicativos");
  const [subMenu, setSubMenu] = useState(null);
  const [diretorios, setDiretorios] = useState("");
  const [sites, setSites] = useState([{domain: "facebook.com", tentativas: 10}, {domain: "tiktok.com", tentativas: 2}]);
  const [apps, setApps] = useState([{name: "Facebook", tentativas: 3}, {name: "TikTok", tentativas: 4}]);
  
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  function BloqueioItem(props){
    return(
      <div className={props.menu == menuActual ? "bloqueioItem bloqueioItemFocused" : "bloqueioItem"} onClick={() => {setMenuActual(props.menu); setSubMenu(null)}}>
        {props.icon}
        <span>{props.text}</span>
       </div>
    );
  }
  
  function Add(props){
    return(
	<AddIcon className="add" color="white" onClick={props.onClick && props.onClick}/>
    );
  }
    

 
  function MenuAplicativos(){
/*    if(apps.length < 1) return <EmptyMenu text="Nenhum aplicativo adicionado" />*/
    return(
      <div className="menuItem" id="menuAplicativos">
	{apps.length < 1 && <EmptyMenu text="Nenhum aplicativo adicionado" />}
        {apps.map((elemento, index)=>{
	  return <Aplicativo key={index} name={elemento.name} loaded={true} tentativas={elemento.tentativas}/>
        }
        )}
	<Add onClick={()=>{setSubMenu("adicionarAplicativos")}}/>
      </div>
    );
  }

  function Aplicativo(props){
    const [appLoading, setAppLoading] = useState(false);
    const [appAccepted, setAppAccepted] = useState(false);
    const [remAppLoading, setRemAppLoading] = useState(false);

    async function addApp(nomeDaApp){
      await sleep(1000);
      setAppLoading(false);
      setAppAccepted(true);
    }
    async function remApp(app){
      await sleep(1000);
      setRemAppLoading(false);
    }

    return(
      <div className="app">
	<div className="app_child1">
          <AndroidIcon color="#358bff"/>
	  <div>
            <span>{props.name}</span>
	    {props.loaded ? <small><small>{props.tentativas} tentativas</small></small> : ""}
	  </div>
	</div>
        {
	props.loaded ?
	(remAppLoading ? <PendingIcon className="remIcon" color="#ff8080"/> : <DeleteIcon className="remIcon" color="#ff8080" onClick={()=>{setRemAppLoading(true); remApp("bruh")}}/>) 
	:
        (appLoading ? <PendingIcon /> : appAccepted ? <CheckIcon /> : <AddIcon onClick={()=>{setAppLoading(true); addApp(props.name)}}/>)
	}
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
	{/*<div>
	  <input type="text" placeholder="Insira o nome do aplicativo"/>
          { }
	</div>*/}
        <Input placeholder="Insira o nome do aplicativo" icon={searchAppLoading ? <PendingIcon /> : <SearchIcon onClick={()=>{setSearchAppLoading(true); searchApp()}}/>}/>
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
          return <Site key={index} domain={elemento.domain} tentativas={elemento.tentativas}/> 
         }
        )}
	<Add onClick={()=>{setSubMenu("adicionarSites")}}/>
      </div>
    );
  }
  function Site(props){
    const [remSiteLoading, setRemSiteLoading] = useState(false);
    
    async function remSite(site){
      await sleep(1000);
      setRemSiteLoading(false);
    }

    return(
      <div className="site">
	<div className="site_child1">
          <SiteIcon color="#358bff"/>
	  <div>
            <span>{props.domain}</span>
	    <small><small>{props.tentativas} tentativas</small></small> 
	  </div>
	</div>
          {remSiteLoading ? <PendingIcon className="remIcon" color="#ff8080" /> : <DeleteIcon className="remIcon" color="#ff8080" onClick={()=>{setRemSiteLoading(true); remSite("")}}/>}
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
	  <Input placeholder="Insira o domínio do site" icon={searchSiteLoading ? <PendingIcon /> : <SearchIcon onClick={()=>{setSearchSiteLoading(true); searchSite()}} />}/>
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
	<Button className={searchedSiteData.allowed ? "addSiteButton" : "addSiteButton buttonDisabled"}> Adicionar site {/*<AddIcon />*/}</Button>
        </>}
      </div>
    );
  }

  function MenuOutros(){
    return(
      <div className="menuItem" id="menuOutros">
	<MenuOutrosServico icon={<InternetIcon color="#358bff"/>} text="Internet" />
	<MenuOutrosServico icon={<CameraIcon color="#358bff"/>} text="Câmera" />
	{/*<MenuOutrosServico icon={<SoundIcon />} text="Silencioso" />*/}
      </div>
    );
  }

  function MenuOutrosServico(props){
    return(
      <div className="outro">
	<div className="outro_child1">
          {props.icon}
          <span>{props.text}</span>
	</div>
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

  function MainContentMenu(){
    if(menuActual == "aplicativos") return <MenuAplicativos /> 
    if(menuActual == "sites") return <MenuSites />
    if(menuActual == "outros") return <MenuOutros />
    /*return(
      <div className="menuContentMenu">
      </div>
     )*/
   }

  function MainContentSubMenu(){
    if(menuActual == "aplicativos") return <AdicionarAplicativos />
    if(menuActual == "sites") return <AdicionarSites />
    if(menuActual == "outros") return <EmptyMenu text="BlockEd (^ v ^)"/>
   }

  return(
    <>
    <div id="main">
      <div id="mainContent">
        <MainContent />
      </div>
      <div id="mainFooter">
        <BloqueioItem icon={<AndroidIcon />} text="Aplicativos" menu="aplicativos"/>
        <BloqueioItem icon={<SiteIcon />} text="Sites" menu="sites"/>
        <BloqueioItem icon={<MoreIcon />} text="Outros"  menu="outros"/>
      </div>
      {/*<HorizontalLine />*/}
      <div id="mainContent2">
        <div className="mainContentMenu">
       	  <MainContentMenu />
        </div>
        {/*<VerticalLine />*/}
        <div className="mainContentMenu mainContentSubMenu">
       	  <MainContentSubMenu />
        </div>
      </div>
    </div>
    </>
    );
}
