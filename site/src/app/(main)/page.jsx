"use client";
import "./page.css";
import { StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon } from "@/Icons.jsx";
import { useEffect, useState } from "react";
//import { TentativasMenu,DetalhesMenu,AppsMenu } from "@/components/main/Charts";
//import { getDayOfWeek } from "@lib/helpers.js";
import AlunosMenu from "@/components/main/AlunoMenu";
import { useAlert } from "@/context/AlertContext";
import Notifications from "@components/Notifications";
import dynamic from 'next/dynamic';
import 'chart.js/auto';

function lineLabels(){
  let daysShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  let now = new Date();
  let static_now = new Date();
  let static_yesterday = new Date();
  static_yesterday.setDate(static_yesterday.getDate() - 1);
  let response = [];

  for(let i = 0; i < 7; i++){
    if(i != 0) now.setDate(now.getDate() - 1)
    else{

    }

    if(now.getDay() == static_now.getDay()) response = ["Hoje", ...response]
    else if(now.getDay() == static_yesterday.getDay()) response = ["Ontem", ...response]
    else{
      response = [daysShort[now.getDay()], ...response];
    }
  }

  return response;
}

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
      ssr: false,
    });
    const dataDoughnut = {
      labels: [
        'Normal',
        'Alerta',
        'Suspeito'
      ],
      datasets: [{
        label: "",
        data: [60,20, 20],
        backgroundColor: [
          '#00cc00',
          '#f9f900',
          '#ee8080'
        ],
        borderWidth: 3,
        borderRadius: 6
      }]
    };
    const optionsDoughnut = {
        plugins: {
          legend: {
      display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      };

      const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
      ssr: false,
    });
  
    
    
    const optionsLine = {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Tentativas de acesso",
          color: "#358bff",
          fill: "black"
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#3598ff"
          },
          grid: {
            display: false
          },
          border: {
      color: "#3598ff"
          }
        },
        y: {
          ticks:{
            color: "#3598ff"
          },
          grid: {
            display: false
          },
          border: {
            display: true,
      color: "#35b8ff"
          },
          beginAtZero: true
        }
      }
    };

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
      ssr: false,
    });
    
    
    const optionsBar = {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Apps mais tentados",
          color: "#358bff",
          fill: "black"
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#3598ff"
          },
          grid: {
            display: false
          },
          border: {
      color: "#3598ff"
          }
        },
        y: {
          ticks:{
            color: "#3598ff"
          },
          grid: {
            display: false,
      color: "#358bff"
          },
          border: {
            display: true,
      color: "#35b8ff"
          },
          beginAtZero: true
        }
      }
    }
    
    const dataBar = {
      labels: ['Facebook', 'Instagram', 'TikTok', 'Whatsapp'],
      datasets: [
        {
          label: 'Apps mais tentados dos últimos dias',
          data: [25, 19, 10, 50],
          backgroundColor: ["#358bff"],
          borderColor: ["#eee"],
          borderWidth: 0,
          borderRadius: 5,
        },
      ],
    };

export function DetalhesMenu({data}){

    function DoughnutTit(props){
        return(
      <div className="homeDoughnutTit">
        <div className="quad" style={{background: props.color}}></div>
        <span>{props.text}</span>
      </div>
        );
      }
  
      return(
        <div className="homeDoughnut">
      <h5>Descrição de alunos</h5>
          <div className="homeDoughnutConteiner">
        <Doughnut data={dataDoughnut} options={optionsDoughnut} />
          </div>
          <div className="homeDoughnutTits">
        <DoughnutTit color="#00cc00" text="Normal" />
        <DoughnutTit color="#f9f900" text="Alerta" />
        <DoughnutTit color="#ee8080" text="Suspeito" />
          </div>
        </div>
      );
}
  
export function TentativasMenu({data}){
  const dataLine = {
      labels: lineLabels(),
      datasets: [
        {
          label: 'Tentativas de acesso',
          data: data,
          fill: false,
          borderColor: '#55abff',
          tension: 0.3,
          fill: true,
          backgroundColor: "#358bff22",
          borderColor: '#358bff',
          tension: 0.1,
          borderWidth: 1.5,
          pointStyle: "circle",
          pointBorderWidth: .9
        },
      ],
    };   
    
  
      return(
        <Line data={dataLine} options={optionsLine}/>
      );
}

export function AppsMenu(){
  
    
    
    return(
      <Bar data={dataBar} options={optionsBar}/>
    );
}

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

function MainGraphConteiner({alunos, overviewMenu, lineData}){
    return(
      <div className="homeOverview">
        {
    overviewMenu == "tentativas" ?
    <TentativasMenu  data={lineData}/> :
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

export default function Home() {
  
  //Constantes
  const [message, setMessage] = useState('ola')
  const [overviewMenu, setOverviewMenu] = useState("tentativas");
  const [alunos, setAlunos] = useState([]);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalDispositivos, setTotalDispositivos] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const [totalSites, setTotalSites] = useState(0);
  const [lineData, setLineData] = useState([0, 0, 0, 0, 0, 0, 0]);
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

  
   
  useEffect(()=>{
    async function fetchData(){
      const response = await fetch('/api/dashboard/')
      const data = await response.json()

      setTotalApps(data.apps)
      setTotalSites(data.sites)
      setTotalAlunos(data.students)
      setTotalDispositivos(data.devices)
      setLineData(data.days)
      
    }
    fetchData()
    const interval = setInterval(()=>fetchData(), 10000)

    return ()=>clearInterval(interval)
  }, [])

  useEffect(()=>{
    showAlert("Nothing")
    console.log(lineLabels())
  }, [])


  useEffect(()=>{
    async function fetchData(){
      let obj = await fetch("/api/student");

      let res = await obj.json();

      setAlunos(res);
    }

    fetchData();

    const interval = setInterval(()=>fetchData(), 10000)

    return ()=>clearInterval(interval)
  }, [])

  
  return (
    <>
    {/* Moblie */}
    <div className="homePage">
      <HomePageHeader totalAlunos={totalAlunos} totalApps={totalApps} totalDispositivos={totalDispositivos} totalSites={totalSites} />
      <Overview />
      <div id="homePageContent">
        <MainGraphConteiner alunos={alunos} overviewMenu={overviewMenu} lineData={lineData}/>
      </div>
    </div>

    {/* Desktop */}
    {/*<div>{message}</div>*/}
    <div className="homePageDesktop">
      <HomePageHeader  totalAlunos={totalAlunos} totalApps={totalApps} totalDispositivos={totalDispositivos} totalSites={totalSites} />
      <div className="desktopGraphConteiner">
        <section> <TentativasMenu data={lineData}/> </section>
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
