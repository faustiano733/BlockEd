"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@components/NavigationRoute.js";
import Loading from "@components/Loading";

import { HorizontalLine, VerticalLine } from "@components/Lines.js";
import Header from "@components/Header.js";
import { StudentIcon, StudentSearchIcon, AndroidIcon, Profile, SiteIcon, DeleteIcon, AddIcon, CheckIcon, PendingIcon, SearchIcon, InternetIcon, CameraIcon, SoundIcon, MoreIcon, CloseIcon, SmartPhoneIcon} from "../../Icons.jsx";
import {EmptyMenu} from "../bloqueio/page.jsx";
//import { Metadata } from "next";

export function Aluno(props){
  return(
    <div className="aluno" onClick={props.onClick && props.onClick}>
      <div className="alunoInfo">
        <StudentIcon color="white" fill={true}/>
        <div>
          <h5>{props.nome}</h5>
          <small>
            <small>
              <span>
                {props.dispositivos}
                {props.dispositivos > 1 ? " dispositivos" : " dispositivo"}
              </span>
            </small>
          </small>
        </div>
      </div>
      {/*<small><span>há {props.ultimaConexao}</span></small>*/}
      <span>{props.ultimaConexao}</span>
    </div>
  );
}

export default function AlunosPage(){
  const [aluno, setAluno] = useState(null);
  const [alunos, setAlunos] = useState(null);
  //const [loading, setLoading] = useState(false);
  const [searchAlunoLoading, setSearchAlunoLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);

  useEffect(()=>{
    async function fetchData(){
      let obj = await fetch("/api/student");
      let resp = await obj.json();

      setAlunos(resp);
    }

    fetchData()
  }, []);

  async function selectStudent(studentName){
    let obj = await fetch(`/api/student?student=${studentName}`);
    let resp = await obj.json();
    setStudentLoading(false);

    setAluno(resp)
  }

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
        <span><SmartPhoneIcon color="#358bff"/> {props.modelo}</span>
        <small><small>{props.conexao}</small></small>
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
	{ searchingAluno ? <CloseIcon color="#358bff" onClick={() => setSearchingAluno(false)}/> : <StudentSearchIcon color="#358bff" onClick={() => setSearchingAluno(true)}/> }
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
        <Aluno nome="Joaquim de Andrade" dispositivos={2} ultimaConexao="há 4 dias" />*/}
        {
        alunos.map((entidade, index) => (
          <Aluno key={`aluno-${index}`} nome={entidade.name} dispositivos={entidade.tot_devices} ultimaConexao={"há 7 dias"/*entidade.ultimaConexao*/} onClick={()=>{setStudentLoading(true); selectStudent(entidade.name)}}/>
        ))
        }
        <SearchAluno />
      </div>
    );
  }

  function SubMenuAluno(){
    if(studentLoading) return <Loading />
    return(
      <>
      <CloseMenu onClick={() => setAluno(null)}/>
      { aluno ? 
        <div className="subMenuAluno">
          <div className="subMenuAlunoIcon">
            <StudentIcon color="white" fill={true}/>
          </div>
          <h3>{aluno.name}</h3>
          {/*<div className="subMenuAlunoInfo">
            <span>Turma: {aluno[0].turma}</span>
            <span>Idade: {aluno[0].idade} anos</span>
            <span>Actividade: <small className="subMenuAlunoInfoActividade">{aluno[0].actividade}</small></span>
          </div>*/}
          <h5>- Dispositivos -</h5>
          <section className="devicesList">
            {
            aluno.devices.map((elemento, index) => {
              return(
                <Dispositivo key={"dispositivo"+index} modelo={"Iphone"/*elemento.modelo*/} conexao={elemento.createdAt} />
              );
            })
            }
          </section>
        </div>
        : <EmptyMenu text="Nenhum aluno seleccionado" />
      }
      </>
    );
  }
  if(!alunos) return <Loading />
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
      <div className="subMenuAlunoDesktop">
        <SubMenuAluno />
      </div>
    </div>
    </>
  );
}
