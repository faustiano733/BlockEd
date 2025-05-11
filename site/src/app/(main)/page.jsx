"use client";
import "./page.css";
import { StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon } from "@/Icons.jsx";
import { useEffect, useState } from "react";
import { TentativasMenu,DetalhesMenu,AppsMenu } from "@/components/main/Charts";
import { getDayOfWeek } from "@lib/helpers.js";
import AlunosMenu from "@/components/main/AlunoMenu";
import { useAlert } from "@/context/AlertContext";
import Notifications from "@components/Notifications";

function HeaderCard(props){
  
  return(
    <div className="headerCard" >
     <div className="headerCardIconConteiner">
      {props.icon}
      {props.value >= 1000 ? props.value : props.value >= 100 ? props.value : props.value >= 10 ? "0"+props.value : "00"+props.value}
     </div>
     <span>{props.text}</span>
    </div>
  )
}
function OverviewOption(props){
  return(
    <div className="overviewOption" style={props.menu == props.overviewMenu ? {background: "white", color: "#404040"} : {}} onClick={props.onClick && props.onClick}>
    {props.text}
    </div>
  );
}

function HomePageHeader({totalAlunos, totalDispositivos,totalApps,totalSites}){
  return(
    <div className="homePageHeader">
<HeaderCard icon={<StudentsIcon color="#358bff"/>} value={totalAlunos} iconBg="#358bff" text="Alunos" />
<HeaderCard icon={<SmartPhoneIcon color="#358bff"/>} value={totalDispositivos} iconBg="#358bff" text="Dispositivos" />
<HeaderCard icon={<AndroidIcon color="#358bff"/>} iconBg="#358bff" value={totalApps} text={"Apps"} />
<HeaderCard icon={<SiteIcon color="#358bff"/>} iconBg="#358bff" value={totalSites} text={"Sites"} />
    </div>
  );
}
export default function Home() {
  
  //Constantes
  const [message, setMessage] = useState('ola')
  const [overviewMenu, setOverviewMenu] = useState("tentativas");
  const [alunos, setAlunos] = useState([{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"},{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"},{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"},{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}]);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalDispositivos, setTotalDispositivos] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const [totalSites, setTotalSites] = useState(0);
  const {showAlert} = useAlert();
  function Overview(){ 
    return(
      <div className="overviewTit">
	<h4>Visão geral</h4>
        <div className="overviewOptions">
          <OverviewOption text="Tentativas" menu="tentativas" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("tentativas")}/>
          <OverviewOption text="Apps" menu="apps" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("apps")}/>
          <OverviewOption text="Alunos" menu="alunos" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("alunos")}/>
          <OverviewOption text="Detalhes" menu="detalhes" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("detalhes")}/>
	</div>
      </div>
    );
  }  

  function MainGraphConteiner(){
    return(
      <div className="homeOverview">
        {
	  overviewMenu == "tentativas" ?
	  <TentativasMenu  /> :
	  overviewMenu == "apps" ?
	  <AppsMenu alunos={alunos} /> :
	  overviewMenu == "alunos" ?
          <AlunosMenu alunos={alunos} /> :
          overviewMenu == "detalhes" ?
          <DetalhesMenu /> :
	  null
           
        }
      </div>
    );
  }
   
  useEffect(()=>{
    async function fetchData(){
      const response = await fetch('/api/dashboard/')
      const data = await response.json()
      setMessage(data)
    }
    fetchData()
  }, [])

  useEffect(()=>{
    showAlert("Nothing")
  }, [])

  
  return (
    <>
    {/* Moblie */}
    <div className="homePage">
      <HomePageHeader totalAlunos={totalAlunos} totalApps={totalApps} totalDispositivos={totalDispositivos} totalSites={totalSites} />
      <Overview />
      <div id="homePageContent">
        <MainGraphConteiner />
      </div>
    </div>

    {/* Desktop */}
    {/*<div>{message}</div>*/}
    <div className="homePageDesktop">
      <HomePageHeader  totalAlunos={totalAlunos} totalApps={totalApps} totalDispositivos={totalDispositivos} totalSites={totalSites} />
      <div className="desktopGraphConteiner">
        <section> <TentativasMenu /> </section>
        <section> <AppsMenu /> </section>
      </div>
      <div className="othersConteiner">
        <section className="section1"><AlunosMenu alunos={alunos} /></section>
        <section className="section2"><DetalhesMenu /></section>
      </div>
    </div>
    <Notifications />
    </>
  );
}
