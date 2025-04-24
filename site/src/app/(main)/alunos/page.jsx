"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@/components/NavigationRoute.js";
import Loading from "@/components/Loading";

import { HorizontalLine, VerticalLine } from "@/components/Lines.js";
import Header from "@/components/Header.js";
import { StudentIcon, StudentSearchIcon, AndroidIcon, Profile, SiteIcon, DeleteIcon, AddIcon, CheckIcon, PendingIcon, SearchIcon, InternetIcon, CameraIcon, SoundIcon, MoreIcon, CloseIcon, SmartPhoneIcon} from "@/Icons.jsx";
import {EmptyMenu} from "../bloqueio/page.jsx";
import Button from "@/components/Button";
//import { Metadata } from "next";

function SearchAluno(props){
  const [searchingAluno, setSearchingAluno] = useState(false);
  return (
    <div className="searchAluno">
      { searchingAluno && <input type="text" placeholder="Insira o nome do aluno"/> }
{ searchingAluno ? <CloseIcon color="#358bff" onClick={() => setSearchingAluno(false)}/> : <StudentSearchIcon color="#358bff" onClick={() => setSearchingAluno(true)}/> }
    </div>
  );
}

function MenuAlunos(){
  const [alunos, setAlunos] = useState(null);
  const [selectdStudent, setSelectdStudent] = useState('')

  function handleSelectStudent(){
    setStudentLoading(true);
    setSelectdStudent(entidade.name)
  }

  useEffect(()=>{
    async function fetchData(){
      let obj = await fetch("/api/student");
      let resp = await obj.json();

      setAlunos(resp);
    }

    fetchData()
  }, []);
  
  if(!alunos) return <Loading />
  return(
    <div className="menuAlunos">
      <AddIcon color='#358bff' />
      {
      alunos.map((entidade, index) => (
        <Aluno key={`aluno-${index}`} nome={entidade.name} dispositivos={entidade.devices.length} ultimaConexao={"há 7 dias"/*entidade.ultimaConexao*/} onClick={()=>{handleSelectStudent}}/>
      ))
      }
      <SearchAluno />
    </div>
  );
}

const Code = ({code, target})=>{
  return(
    <>
    <section className="code">
        {code.substring(0,4).split('').map((letter,index)=><span key={index} className="symbol">{letter}</span>)}
        -
        {code.substring(4).split('').map((letter,index)=><span key={index} className="symbol">{letter}</span>)}
    </section>



    <CountdownTimer target={target} />    
    </>
  )
}

function CountdownTimer ({target}) {
  const [timeLeft, setTimeLeft] = useState('00:00');
  const [timeIsExpired, setTimeIsExpired]= useState(false)
      
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      target = new Date(target);
      
      // Se já passou do horário hoje, vai para amanhã
      if (now > target) {
        setTimeIsExpired(true)
      }

      const diff = target - now;
      const minutes = Math.floor(diff / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft(`${minutes==='-1'?"00":minutes}:${seconds==='-1'?'00':seconds}`);
    };

    if(!timeIsExpired){
    updateTimer();
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval);
  }

    
  }, [timeIsExpired,target]);

  return (
    <div>
      <h3><div style={{color:'#358bff'}}>{timeIsExpired?'O codigo expirado':'O codigo expira em'} <span style={timeLeft.startsWith('00')?{color:'red'}:{}}>{timeLeft}</span> </div> </h3>
    </div>
  );
}

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

const SubMenuAddStudent = ({close})=>{
  const [code, setCode] = useState(null)
  const [expiresAt,setExpiresAt] = useState(null)
  const Information = ()=>(<div className="information">
    <p>
      Para vincular um aluno à instituição:
      Clique em "Gerar Código".
      Um código alfanumérico de 8 dígitos será exibido na tela.
    </p>
    <p>
    Próximo passo:<br/>
    O código deverá ser inserido diretamente no aplicativo móvel para concluir a vinculação automática à instituição.
    </p>
  </div>)

  

  const handleGenerateCode = async ()=>{
    const response = await fetch('/api/student',{
      headers:{
        'Content-Type':'application/json'
      },
      method:'POST'
    })

    const data = await response.json()
    setCode(data.code)
    setExpiresAt(data.expiresAt)

  }

  return(
    <>
      <div className="addStudentMenu">
        <CloseMenu onClick={close} />
        {code?<Code code={code} target={expiresAt}/>:<Information/>}
        
        <Button onClick={handleGenerateCode}>Gerar Novo Codigo</Button>
      </div>
    </>
  )

}

function CloseMenu(props){
  return(
    <div className="closeButton" style={{background: props.bg ? props.bg : "white"}}>
      <CloseIcon onClick={props.onClick} />
    </div>
  );
}

export default function AlunosPage(){
  const [aluno, setAluno] = useState(null);
  //const [loading, setLoading] = useState(false);
  const [searchAlunoLoading, setSearchAlunoLoading] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(true)

  async function selectStudent(studentName){
    let obj = await fetch(`/api/student?student=${studentName}`);
    let resp = await obj.json();
    setStudentLoading(false);

    setAluno(resp)
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

  function SearchAlunoDesktop(props){
    return(
      <div className="searchAlunoDesktop">
        <input type="text" placeholder="Insira o nome do aluno"/>
        {searchAlunoLoading ? <PendingIcon /> : <SearchIcon onClick={() =>{ setSearchAlunoLoading(true); pesquisarAluno("Carlos")}}/>}
      </div>
    );
  }

  function SubMenu(){
    if(studentLoading) return <Loading />
    return(
      <>
       {isAddingStudent?<SubMenuAddStudent close={()=>setIsAddingStudent(false)}/> : <SubMenuAluno/>}
      </>
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

  return(
    <>
    <div id="alunosPage">
      <AddIcon color='#358bff' onClick={()=>setIsAddingStudent(true)}/>
      { aluno || isAddingStudent ? <SubMenu /> : <MenuAlunos />}
    </div>

    <div id="alunosPageDesktop">
      <div className="menuAlunosDesktop">
        <SearchAlunoDesktop />
        <MenuAlunos addStudent={()=>setIsAddingStudent(true)}/>
      </div>
      <div className="subMenuAlunoDesktop">
        {<SubMenu />}
      </div>
    </div>
    </>
  );
}
