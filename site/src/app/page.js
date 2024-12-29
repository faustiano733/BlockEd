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
  labels: ['13/12', '14/12', '15/12', 'Ontem', 'Hoje'],
  datasets: [
    {
      label: 'Tentativas de acesso',
      data: [65, 59, 80, 81, 56],
      fill: false,
      borderColor: '#55abff',
      tension: 0.1,
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
function MainGraphConteiner(){
  return(
    <div className="graphConteiner">
	  {/*<div className="pieGraphConteiner">
	    <Doughnut data={dataDoughnut} options={optionsDoughnut} />
          </div>*/}
	  {/*<div className="lineGraphConteiner">*/}
	    <Line data={data} />
	    <Bar data={dataBar} />
	  {/*</div>*/}
    </div>
  );
}
export default function Home() {
  /*const [data, setData] = useState([
        { name: "Geeksforgeeks", students: 400 },
        { name: "Technical scripter", students: 700 },
        { name: "Geek-i-knack", students: 200 },
        { name: "Geek-o-mania", students: 1000 },
    ]);*/

  function HeaderCard(props){
    const [mostrarAlunos, setMostrarAlunos] = useState(false);
    const [alunosSuspeitos, setAlunosSuspeitos] = useState(0);
    const [alunosModerados, setAlunosModerados] = useState(0);
    const [alunosNormais, setAlunosNormais] = useState(0);

    return(
      <div className="headerCard" >
	<div className="headerCardIconConteiner">
	{props.icon}
	</div>
        {props.value && <small>{props.value}</small>}
       	<span>{props.text}</span>
      </div>
    )
  }

  return (
    <>
    <div className="main">
      <div id="homePageHeader">
	<HeaderCard icon={<StudentsIcon />} value={8} iconBg="#358bff" text="alunos" />
	<HeaderCard icon={<SmartPhoneIcon />} value={12} iconBg="#358bff" text="dispositivos" />
	<HeaderCard icon={<AndroidIcon />} iconBg="#358bff" value={3} text={"apps"} />
	<HeaderCard icon={<SiteIcon />} iconBg="#358bff" value={4} text={"sites"} />
	<HeaderCard icon={<ProfileIcon />} iconBg="#358bff" text={"ceutron"} />
      </div>
      <div id="homePageContent">
	<MainGraphConteiner />
	<div className="alunosContent">
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
	  <Aluno nome="Zezé" dispositivos={3} ultimaConexao="há 7 dias" />
        </div>
      </div>
    </div>
    </>
  );
}
