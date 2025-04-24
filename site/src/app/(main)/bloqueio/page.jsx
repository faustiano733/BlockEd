"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import { HorizontalLine, VerticalLine } from "@components/Lines.js";
import Header from "@components/Header.js";
import Input from "@components/Input.js";
import Button from "@components/Button.js";
import { AndroidIcon, SiteIcon, DeleteIcon, AddIcon, CheckIcon, PendingIcon, SearchIcon, InternetIcon, CameraIcon, SoundIcon, MoreIcon} from "@/Icons.jsx";
import { Metadata } from "next";
import Loading from "@components/Loading";


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export function EmptyMenu({text}){
  return(
    <section className="emptyMenu">
      { text }
    </section>
  );
}

  function Aplicativo(props){
    const [appLoading, setAppLoading] = useState(false);
    const [appAccepted, setAppAccepted] = useState(false);
    const [remAppLoading, setRemAppLoading] = useState(false);

    async function addApp(app){
      await fetch('/api/bloqueios/app',{
        headers:{
          'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({name:app.title,package:app.appId})
      })
      setAppLoading(false);
      setAppAccepted(true);
    }
    async function handleRemApp(){
      await fetch('/api/bloqueios/app',{
        headers:{
          'Content-Type':'application/json'
        },
        method:'DELETE',
        body:JSON.stringify({name:props.app.name,id:props.app.id})
      })
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
          (remAppLoading ? <PendingIcon className="remIcon" color="#ff8080"/> : 
            <DeleteIcon className="remIcon" color="#ff8080" 
            onClick={()=>{setRemAppLoading(true); handleRemApp()}}/>) 
          :
          (appLoading ? <PendingIcon /> : appAccepted ? <CheckIcon /> : <AddIcon onClick={()=>{setAppLoading(true); addApp(props.app)}}/>)
  }
      </div>
    );
  }

  function AdicionarAplicativos(){
    const [searchAppLoading, setSearchAppLoading] = useState(false);
    const [searchedApps, setSearchedApps] = useState(null);
    const [input, setInput] = useState(null);

    async function searchApp(){
      
      if(!input){ 
        alert("Digite alguma coisa")
        setSearchAppLoading(false);
        return;
      }
      
      let obj = await fetch("/api/bloqueios/app/search?term="+input.target.value);
      let res = await obj.json();
      setSearchedApps(res);

      setSearchAppLoading(false);
    }
    return(
      <div className="menuItem" id="adicionarAplicativos">
  
        <Input onChange={setInput} placeholder="Insira o nome do aplicativo" icon={searchAppLoading ? <PendingIcon /> : <SearchIcon onClick={()=>{setSearchAppLoading(true); searchApp()}}/>}/>
        <small>Resultados</small>
        <section>
          {(searchedApps) ? (searchedApps.length < 1) && <EmptyMenu text="Nenhum app encontrado"/> : <EmptyMenu text="Pesquise o nome do app"/>}
          
          {searchedApps && searchedApps.map((elemento, index)=>{
          return <Aplicativo key={index} name={elemento.title} app={elemento} />
          })}
        </section>
      </div>
    );
  }

  function Site(props){
    const [remSiteLoading, setRemSiteLoading] = useState(false);
    
    async function remSite(){
      await fetch('/api/bloqueios/site',{
        headers:{
          'Content-Type':'application/json'
        },
        method:'DELETE',
        body:JSON.stringify({domain:props.site.domain,id:props.site.id})
      })

      setTimeout(()=>setRemSiteLoading(false),1500)
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
          {remSiteLoading ? <PendingIcon className="remIcon" color="#ff8080" /> : <DeleteIcon className="remIcon" color="#ff8080" onClick={()=>{setRemSiteLoading(true); remSite()}}/>}
        </div>
     );
  }

  function AdicionarSites() {
    const [searchSiteLoading, setSearchSiteLoading] = useState(false);
    const [validatedSite, setValidatedSite] = useState(null);
    const [url, setURL] = useState('');
    
    async function validateSite() {
      if (!url.trim()) return;
      setSearchSiteLoading(true);
    
      try {
        const response = await fetch("/api/bloqueios/site/validate", {
          headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ url: url.trim() }) // Envia apenas a string
        });

        const data = await response.json()
        setValidatedSite(data)
        
      } catch (error) {
        setValidatedSite(null)
      } finally {
        setSearchSiteLoading(false);
      }
    }

    const handleInputChange = (e) => {
      setURL(e.target.value);
    };

    const handleSearch = () => {
      if (url.trim()) {
        setSearchSiteLoading(true);
        validateSite();
      }
    };

    const handleAddSite = async ()=>{
      
      setSearchSiteLoading(true)
      const response = await fetch('/api/bloqueios/site',{
        headers:{
          'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({domain:validatedSite.normalizedUrl})
      })

      setTimeout(()=>setSearchSiteLoading(false),1500)
      
    }

    return (
      <div className="menuItem" id="adicionarSites">
        <div>
          <Input 
            value={url}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            id="inputSearchSite" 
            placeholder="Insira o domínio do site" 
            icon={searchSiteLoading ? 
              <PendingIcon /> : 
              <SearchIcon onClick={handleSearch} />
            }
          />
        </div>
        
        {validatedSite && (
          <>
            <section>
              <span>Status: {validatedSite.status }</span>
              <span>
                {validatedSite.normalizedUrl?('Domínio: '+validatedSite.normalizedUrl):
                ('Não é possivel adicionar o site:\n'+validatedSite.error.toLowerCase())}
              </span>
              {validatedSite.status===202 &&(<span>{validatedSite.error.toLowerCase()}</span>)}
              {validatedSite.normalizedUrl&&(
                <Button onClick={handleAddSite} >
                {searchSiteLoading ? 
                  <PendingIcon color={'#fff'}/> :
                  'Adicionar Site'}
                  </Button>)}
            </section>
          </>
        )}
      </div>
    );
  }
  function Add(props){
    return <AddIcon className="add" color="white" onClick={props.onClick && props.onClick}/> 
  }
  
  function MenuAplicativos({apps, setSubMenu}){
    /*    if(apps.length < 1) return <EmptyMenu text="Nenhum aplicativo adicionado" />*/
    if(!apps) return <Loading bg="transparent" />
    return(
      <div className="menuItem" id="menuAplicativos">
        {apps.length < 1 && <EmptyMenu text="Nenhum aplicativo adicionado" />}
        {apps.map((elemento, index)=>{
          if(!elemento.active) return null;
          return <Aplicativo key={"app"+index} app={elemento} name={elemento.name} loaded={true} tentativas={4/*elemento.tentativas*/}/>
        }
        )}
        <Add onClick={()=>{setSubMenu("adicionarAplicativos")}}/>
      </div>
    );
  }

  function MenuSites({sites, setSubMenu}){
    if(!sites) return <Loading bg="transparent" />
    return(
      <div className="menuItem" id="menuSites">
        {sites.length < 1 && <EmptyMenu text="Nenhum site adicionado" /> }
        {sites.map((elemento, index)=>{
          return <Site key={index} domain={elemento.domain/*domain*/} site={elemento} tentativas={4/*elemento.tentativas*/}/> 
         }
        )}
      <Add onClick={()=>{setSubMenu("adicionarSites")}}/>
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

   function MainContent({menuActual, subMenu, apps, sites, setSubMenu}){
      if(subMenu == "adicionarAplicativos") return <AdicionarAplicativos />
      if(subMenu == "adicionarSites") return <AdicionarSites />
        if(menuActual == "aplicativos") return <MenuAplicativos apps={apps} setSubMenu={setSubMenu}/>
        if(menuActual == "sites") return <MenuSites sites={sites} setSubMenu={setSubMenu}/>
        if(menuActual == "outros") return <MenuOutros />
   }

  function MainContentMenu({menuActual, apps, sites, setSubMenu}){
    if(menuActual == "aplicativos") return <MenuAplicativos apps={apps} setSubMenu={setSubMenu}/> 
    if(menuActual == "sites") return <MenuSites sites={sites} setSubMenu={setSubMenu}/>
    if(menuActual == "outros") return <MenuOutros />
    /*return(
      <div className="menuContentMenu">
      </div>
     )*/
   }

  function MainContentSubMenu({menuActual}){
    if(menuActual == "aplicativos") return <AdicionarAplicativos />
    if(menuActual == "sites") return <AdicionarSites />
    if(menuActual == "outros") return <EmptyMenu text="BlockEd (^ v ^)"/>
  }
  const Bloqueios = ()=>{
    const [menuActual, setMenuActual] = useState("aplicativos");
    const [subMenu, setSubMenu] = useState(null);
    const [diretorios, setDiretdorios] = useState("");
    const [sites, setSites] = useState(null);
    const [apps, setApps] = useState(null);
    useEffect(()=>{
      async function fetchData(){
        let obj = await fetch("/api/bloqueios/app");
        let resp = await obj.json();
  
        setApps(resp);
      }
  
      fetchData()
      const interval = setInterval(()=>{
      fetchData();
      }, 3000)
      
      return ()=>clearInterval(interval);
    }, [])
  
    useEffect(()=>{
      async function fetchData(){
        let obj = await fetch("/api/bloqueios/site");
        let resp = await obj.json();
  
        setSites(resp);
      }
  
      fetchData()
      const interval = setInterval(()=>{
        fetchData();
      }, 3000)
  
      return ()=>clearInterval(interval);
    }, []) 
  
    function BloqueioItem(props){
      return(
        <div className={props.menu == menuActual ? "bloqueioItem bloqueioItemFocused" : "bloqueioItem"} onClick={() => {setMenuActual(props.menu); setSubMenu(null)}}>
          {props.icon}
          <span>{props.text}</span>
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
        <div id="mainContent">
          <MainContent menuActual={menuActual} subMenu={subMenu} apps={apps} sites={sites} setSubMenu={setSubMenu}/>
        </div>
        <div id="mainFooter">
          <BloqueioItem icon={<AndroidIcon />} text="Aplicativos" menu="aplicativos"/>
          <BloqueioItem icon={<SiteIcon />} text="Sites" menu="sites"/>
          <BloqueioItem icon={<MoreIcon />} text="Outros"  menu="outros"/>
        </div>
        {/*<HorizontalLine />*/}
        <div id="mainContent2">
          <div className="mainContentMenu">
             <MainContentMenu menuActual={menuActual} apps={apps} sites={sites} setSubMenu={setSubMenu}/>
          </div>
          {/*<VerticalLine />*/}
          <div className="mainContentMenu mainContentSubMenu">
             <MainContentSubMenu menuActual={menuActual}/>
          </div>
        </div>
      </div>
      </>
      );
  }

export default Bloqueios
