"use client";
import Image from "next/image";
import "./page.css";
import {Aluno} from "./alunos/page.js";
import { ProfileIcon, StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon } from "../Icons.jsx";
import { useEffect, useState } from "react";
/*import { PieChart, Pie, Tooltip } from "recharts";*/
import dynamic from 'next/dynamic';
import 'chart.js/auto';

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});
const data = {
  labels: ["Qui", "Sex", 'Sab', 'Dom', 'Seg', 'Ontem', 'Hoje'],
  datasets: [
    {
      label: 'Tentativas de acesso',
      data: [65, 59, 80, 81, 56, 70, 100],
      fill: false,
      borderColor: '#55abff',
      tension: 0.3,
    },
  ],
};

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
});
const dataBar = {
  labels: ['Facebook', 'Instagram', 'TikTok'],
  datasets: [
    {
      label: 'Apps mais tentados dos últimos dias',
      data: [25, 19, 10],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

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
    label: "Actividade dos alunos",
    data: [60,20, 20],
    backgroundColor: [
      '#00cc00',
      '#f9f900',
      '#ee8080'
    ]
  }]
};

const optionsDoughnut = {
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
	  boxWidth: 10,
	  padding: 2
        }
      },
    },
    layout: {
      padding: {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
      }
    },
    responsive: false,
    maintainAspectRatio: false,
  };

export default function Home() {
  /*const [data, setData] = useState([
        { name: "Geeksforgeeks", students: 400 },
        { name: "Technical scripter", students: 700 },
        { name: "Geek-i-knack", students: 200 },
        { name: "Geek-o-mania", students: 1000 },
    ]);*/
  const [overviewMenu, setOverviewMenu] = useState("tentativas");

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
	<HeaderCard icon={<StudentsIcon color="#358bff"/>} value={8} iconBg="#358bff" text="Alunos" />
	<HeaderCard icon={<SmartPhoneIcon color="#358bff"/>} value={12} iconBg="#358bff" text="Dispositivos" />
	<HeaderCard icon={<AndroidIcon color="#358bff"/>} iconBg="#358bff" value={3} text={"Apps"} />
	<HeaderCard icon={<SiteIcon color="#358bff"/>} iconBg="#358bff" value={4} text={"Sites"} />
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
      <Line data={data}/>
    );
  }
  
  function AppsMenu(){
    return(
      <Bar data={dataBar} />
    );
  }

  function AlunosMenu(){
    return null
  }
  
  function DetalhesMenu(){
    return(
      <Doughnut data={dataDoughnut} options={optionsDoughnut} />
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
  return (
    <>
    <div className="homePage">
      <HomePageHeader />
      <Overview />
      <div id="homePageContent">
	<MainGraphConteiner />
      </div>
    </div>
    </>
  );
}
