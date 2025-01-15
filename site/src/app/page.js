"use client";
import Image from "next/image";
import "./page.css";
import {Aluno} from "./alunos/page.js";
import { ProfileIcon, StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon } from "../Icons.jsx";
import { useEffect, useState } from "react";
/*import { PieChart, Pie, Tooltip } from "recharts";*/
import dynamic from 'next/dynamic';
import 'chart.js/auto';


export default function Home() {
  /*const [data, setData] = useState([
        { name: "Geeksforgeeks", students: 400 },
        { name: "Technical scripter", students: 700 },
        { name: "Geek-i-knack", students: 200 },
        { name: "Geek-o-mania", students: 1000 },
    ]);*/
  const [overviewMenu, setOverviewMenu] = useState("tentativas");
  const [alunos, setAlunos] = useState([{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"},{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"},{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"},{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}]);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalDispositivos, setTotalDispositivos] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const [totalSites, setTotalSites] = useState(0);

  function HeaderCard(props){
    const [mostrarAlunos, setMostrarAlunos] = useState(false);
    const [alunosSuspeitos, setAlunosSuspeitos] = useState(0);
    const [alunosModerados, setAlunosModerados] = useState(0);
    const [alunosNormais, setAlunosNormais] = useState(0);
    
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

  function HomePageHeader(){
    return(
      <div className="homePageHeader">
	<HeaderCard icon={<StudentsIcon color="#358bff"/>} value={totalAlunos} iconBg="#358bff" text="Alunos" />
	<HeaderCard icon={<SmartPhoneIcon color="#358bff"/>} value={totalDispositivos} iconBg="#358bff" text="Dispositivos" />
	<HeaderCard icon={<AndroidIcon color="#358bff"/>} iconBg="#358bff" value={totalApps} text={"Apps"} />
	<HeaderCard icon={<SiteIcon color="#358bff"/>} iconBg="#358bff" value={totalSites} text={"Sites"} />
	{/*<HeaderCard icon={<ProfileIcon />} iconBg="#358bff" text={"ceutron"} />*/}
      </div>
    );
  }
  
  function Overview(){
    function OverviewOption(props){
      return(
        <div className="overviewOption" style={props.menu == overviewMenu ? {background: "white", color: "#404040"} : {}} onClick={props.onClick && props.onClick}>
        {props.text}
        </div>
      );
    }

    return(
      <div className="overviewTit">
	<h4>Visão geral</h4>
        <div className="overviewOptions">
          <OverviewOption text="Tentativas" menu="tentativas" onClick={()=>setOverviewMenu("tentativas")}/>
          <OverviewOption text="Apps" menu="apps" onClick={()=>setOverviewMenu("apps")}/>
          <OverviewOption text="Alunos" menu="alunos" onClick={()=>setOverviewMenu("alunos")}/>
          <OverviewOption text="Detalhes" menu="detalhes" onClick={()=>setOverviewMenu("detalhes")}/>
	</div>
      </div>
    );
  }

  function TentativasMenu(){
    return(
      <Line data={dataLine} options={optionsLine}/>
    );
  }
  
  function AppsMenu(){
    return(
      <Bar data={dataBar} options={optionsBar}/>
    );
  }

  function AlunosMenu(){
    return(
      <div className="homePageAlunos">
	<div className="homePageAlunosSection">
	  { alunos.map((entidade, index)=>(
	    <Aluno key={"aluno"+index} nome={entidade.nome} dispositivos={entidade.dispositivos} ultimaConexao={entidade.ultimaConexao} />)
	    )
	  }
	</div>
	<span className="homePageAlunosText">Ver mais</span>
      </div>
    );
  }
  
  function DetalhesMenu(){
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

  function MainGraphConteiner(){
    return(
      <div className="homeOverview">
        {
	  overviewMenu == "tentativas" ?
	  <TentativasMenu /> :
	  overviewMenu == "apps" ?
	  <AppsMenu /> :
	  overviewMenu == "alunos" ?
          <AlunosMenu /> :
          overviewMenu == "detalhes" ?
          <DetalhesMenu /> :
	  null
           
        }
      </div>
    );
  }
  
  const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
  });
  const dataLine = {
    labels: ["Qui", "Sex", 'Sab', 'Dom', 'Seg', 'Ontem', 'Hoje'],
    datasets: [
      {
        label: 'Tentativas de acesso',
        data: [65, 59, 80, 81, 56, 70, 100],
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
/*
  useEffect(()=>{
    async function fetchData(){
      let objecto = await fetch("/api/dashboard");
      let resposta = await objecto.json();

      setTotalAlunos(resposta.alunos)
      setTotalDispositivos(resposta.dispositivos)
      setTotalApps(resposta.apps)
      setTotalSites(resposta.sites)
      let data = new Date(resposta.semana[1].Data);
      alert(data.getDay())

    }

    fetchData();
  }, [])

  /*useEffect(()=>{
    async func
  }, [])*/
  return (
    <>
    <div className="homePage">
      <HomePageHeader />
      <Overview />
      <div id="homePageContent">
	<MainGraphConteiner />
      </div>
    </div>
    <div className="homePageDesktop">
      <HomePageHeader />
      <div className="desktopGraphConteiner">
	<section> <TentativasMenu /> </section>
	<section> <AppsMenu /> </section>
      </div>
      <div className="othersConteiner">
	<section className="section1"><AlunosMenu /></section>
	<section className="section2"><DetalhesMenu /></section>
      </div>
    </div>
    </>
  );
}
