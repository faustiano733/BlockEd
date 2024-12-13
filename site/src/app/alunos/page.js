"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import { HorizontalLine, VerticalLine } from "@components/Lines.js";
import Header from "@components/Header.js";
import { StudentIcon, StudentSearchIcon, AndroidIcon, Profile, SiteIcon, DeleteIcon, AddIcon, CheckIcon, PendingIcon, SearchIcon, InternetIcon, CameraIcon, SoundIcon, MoreIcon, CloseIcon} from "../../Icons.jsx";
//import { Metadata } from "next";


export default function AlunosPage(){
  const [aluno, setAluno] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);

  function Aluno(props){
    return(
      <div className="aluno">
        <div className="alunoInfo">
          <StudentIcon color="white" fill={true}/>
          <div>
	    <h5>{props.nome}</h5>
	    <small><small><span>{props.dispositivos}{props.dispositivos > 1 ? " dispositivos" : " dispositivo"}</span></small></small>
	  </div>
	</div>
	{/*<small><span>há {props.ultimaConexao}</span></small>*/}
	<small><span>{props.ultimaConexao}</span></small>
      </div>
    );
  }
  
  function SearchAluno(props){
    const [searchingAluno, setSearchingAluno] = useState(false);
    return (
      <div className="searchAluno">
        { searchingAluno && <input type="text" placeholder="Insira o nome do aluno"/> }
	{ searchingAluno ? <CloseIcon onClick={() => setSearchingAluno(false)}/> : <StudentSearchIcon onClick={() => setSearchingAluno(true)}/> }
      </div>
    );
  }
  function MenuAlunos(){
    return(
      <div className="menuAlunos">
	<Aluno nome="Joaquim de Andrade" dispositivos={1} ultimaConexao="há 35 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Joaquim de Andrade" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Joaquim de Andrade" dispositivos={2} ultimaConexao="há 4 dias" />
	<SearchAluno />
      </div>
    );
  }

  function SubMenuAluno(){
    return(
      <div className="subMenuAluno">2
      </div>
    );
  }
  return(
    <>
    <div id="alunosPage">
      { aluno ? <SubMenuAluno /> : <MenuAlunos />}
    </div>
    </>
    );
}
