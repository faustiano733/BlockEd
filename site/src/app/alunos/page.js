"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import { HorizontalLine, VerticalLine } from "@components/Lines.js";
import Header from "@components/Header.js";
import { StudentIcon, StudentSearchIcon, AndroidIcon, Profile, SiteIcon, DeleteIcon, AddIcon, CheckIcon, PendingIcon, SearchIcon, InternetIcon, CameraIcon, SoundIcon, MoreIcon, CloseIcon, SmartPhoneIcon} from "../../Icons.jsx";
import {EmptyMenu} from "../bloqueio/page.js";
//import { Metadata } from "next";

export function Aluno(props){
    return(
      <div className="aluno" onClick={props.onClick && props.onClick}>
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
export default function AlunosPage(){
  const [aluno, setAluno] = useState(null);
  const [alunos, setAlunos] = useState([{nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}, {nome: "Carlos Chagas Bastos Santos", dispositivos: 3, ultimaConexao: "há 7 dias"}]);
  const [loading, setLoading] = useState(false);
  const [searchAlunoLoading, setSearchAlunoLoading] = useState(false);

  function CloseMenu(props){
    return(
      <div className="closeButton" style={{background: props.bg ? props.bg : "white"}}>
      	<CloseIcon onClick={props.onClick} />
      </div>
    );
  }


  
  function Dispositivo(props){
    return(
      <div className="alunoDispositivo">
	<h6><SmartPhoneIcon /> {props.modelo}</h6>
	<small>{props.conexao}</small>
      </div>
    );
  }
  function pesquisarAluno(nomeDoAluno){
    setTimeout(()=> setSearchAlunoLoading(false), 3000);
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
  function SearchAlunoDesktop(props){
    return(
      <div className="searchAlunoDesktop">
        <input type="text" placeholder="Insira o nome do aluno"/>
        {searchAlunoLoading ? <PendingIcon /> : <SearchIcon onClick={() =>{ setSearchAlunoLoading(true); pesquisarAluno("Carlos")}}/>}
      </div>
    );
  }
  function MenuAlunos(){
    return(
      <div className="menuAlunos">
	{/*<Aluno nome="Joaquim de Andrade" dispositivos={1} ultimaConexao="há 35 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Carlos Chagas Bastos Santos" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Joaquim de Andrade" dispositivos={2} ultimaConexao="há 4 dias" />
	<Aluno nome="Joaquim de Andrade" dispositivos={2} ultimaConexao="há 4 dias" />*/}
        {
	alunos.map((entidade, index) => (
	  <Aluno key={`aluno-${index}`} nome={entidade.nome} dispositivos={entidade.dispositivos} ultimaConexao={entidade.ultimaConexao} onClick={() => setAluno([{nome: "Carlos Chagas Bastos Santos", turma: "TI13B", idade:19, processo: "00578", actividade: "Normal"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "IPhone 12", last_connection:"há 12 dias"}, {modelo: "Samsung A13", last_connection:"há 1 dia"}])}/>
	))
	}
	<SearchAluno />
      </div>
    );
  }

  function SubMenuAluno(){
    return(
      <>
      <CloseMenu onClick={() => setAluno(null)}/>
      { aluno ? 
      <div className="subMenuAluno">
	<div className="subMenuAlunoIcon">
	  <StudentIcon color="white" fill={true}/>
	</div>
	<h3>{aluno[0].nome}</h3>
	<div className="subMenuAlunoInfo">
	  <span>Processo: {aluno[0].processo}</span>
	  <span>Turma: {aluno[0].turma}</span>
	  <span>Idade: {aluno[0].idade} anos</span>
	  <span style={{color: (aluno[0].actividade.toLowerCase() == "normal" ? "#00bb00" : "#ff0000")}}>Actividade: {aluno[0].actividade}</span>
	</div>
	<h5>- Dispositivos -</h5>
	{
	  aluno.map((elemento, index) => {
	    if(index == 0) return null;
	    else return(
	      <Dispositivo key={"dispositivo"+index} modelo={elemento.modelo} conexao={elemento.last_connection} />
	    );
	  })
	}
      </div>
      : <EmptyMenu text="Nenhum aluno seleccionado" />
      }
      </>
    );
  }
  return(
    <>
    <div id="alunosPage">
      { aluno ? <SubMenuAluno /> : <MenuAlunos />}
    </div>
    <div id="alunosPageDesktop">
      <div className="menuAlunosDesktop">
	<SearchAlunoDesktop />
        <MenuAlunos />
      </div>
      <VerticalLine />
      <div className="subMenuAlunoDesktop">
	<SubMenuAluno />
      </div>
    </div>
    </>
    );
}
