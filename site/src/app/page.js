"use client";
import Image from "next/image";
import "./page.css";
import { ProfileIcon, StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon } from "../Icons.jsx";
import { useEffect, useState } from "react";
export default function Home() {
  
  function HeaderCard(props){
    const [mostrarAlunos, setMostrarAlunos] = useState(false);
    const [alunosSuspeitos, setAlunosSuspeitos] = useState(0);
    const [alunosModerados, setAlunosModerados] = useState(0);
    const [alunosNormais, setAlunosNormais] = useState(0);
    return(
      <div className="headerCard" style={{color: props.iconBg}}>
	<div className="headerCardIconConteiner" style={{background: props.iconBg}}>
	{props.icon}
	</div>
        {props.value && props.value}
       	<span>{props.text}</span>
      </div>
    )
  }
  return (
    <>
    <div className="main">
      <div id="homePageHeader">
	<HeaderCard icon={<StudentsIcon color="white"/>} value={8} iconBg="#358bff" text="alunos" />
	<HeaderCard icon={<SmartPhoneIcon color="white"/>} value={12} iconBg="#358bff" text="dispositivos" />
	<HeaderCard icon={<AndroidIcon color="white" />} iconBg="#358bff" value={3} text={"apps"} />
	<HeaderCard icon={<SiteIcon color="white" />} iconBg="#358bff" value={4} text={"sites"} />
	<HeaderCard icon={<ProfileIcon color="white" />} iconBg="#358bff" text={"ceutron"} />
      </div>
      <div id="homePageContent">
	<div className="graphConteiner">
	  <div className="pieGraphConteiner">
          </div>
	  <div className="lineGraphConteiner">
	  </div>
	</div>
	<div className="alunosContent">
        </div>
      </div>
    </div>
    </>
  );
}
