"use client";
import "./page.css";
import {useEffect, useState} from "react";
import NavigationRoute from "@/components/NavigationRoute.js";
import Loading from "@/components/Loading";

import { HorizontalLine, VerticalLine } from "@/components/Lines.js";
import Header from "@/components/Header.js";
import { StudentAddIcon, StudentIcon, StudentSearchIcon, AndroidIcon, Profile, SiteIcon, DeleteIcon, AddIcon, CheckIcon, PendingIcon, SearchIcon, InternetIcon, CameraIcon, SoundIcon, MoreIcon, CloseIcon, SmartPhoneIcon} from "@/Icons.jsx";
import {EmptyMenu} from "../bloqueio/page.jsx";
import Button from "@/components/Button";
import Confirm from "@components/Confirm.js";
import { useAlert } from "@/context/AlertContext";
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

function MenuAlunos({setAluno}){
  const [alunos, setAlunos] = useState(null);
  const [selectdStudent, setSelectdStudent] = useState('')

  async function handleSelectStudent(id){
    let obj = await fetch("/api/student?q="+id);
    let resp = await obj.json()

    setAluno(resp)
  }

  useEffect(()=>{
    /*async function fetchData(){
      let obj = await fetch("/api/student");
      let resp = await obj.json();

      setAlunos(resp);
    }*/

    const controller = new AbortController()
    let isActive = true

    async function fetchData(){
      while(isActive){

        if (document.hidden) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }
        
        try{
          let obj = await fetch("/api/student", {
            signal: controller.signal
          });
          
          let res = await obj.json();
          setAlunos(res);
        } catch(error) {

        } finally {

        }

        await new Promise((resolve)=>setTimeout(resolve, 5000))
      }
    }

    fetchData();
    //const interval = setInterval(()=>fetchData(), 10000)

    return ()=>{
      isActive = false
      controller.abort()
    }
  }, []);

  function timeDiff(before){
    let agr = new Date();
    let bf = new Date(before)
    let d = agr - bf;
    let sem = Math.floor(d / (1000 * 60 * 60 * 24 * 7))
    let day = Math.floor(d / (1000 * 60 * 60 * 24))
    let h = Math.floor(d / (1000 * 60 * 60))
    let m = Math.floor(d / (1000 * 60))
    let s = Math.floor(d / (1000))

    let diff = "há ";

    if(sem > 0)
      diff+=sem + " semana(s)"
    else if(day > 0)
      diff += day + " dia(s)"
    else if(h>0)
      diff+=h + " hora(s)"
    else if(m>0)
      diff+=m + " minuto(s)"
    else{
      diff+= s + " segundo(s)"
    }
    return diff;
  }
  
  if(!alunos) return <Loading bg="transparent"/>
  if(alunos.length == 0) 
    return(
      <div style={{color: "gray", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", backgroundColor: "transparent"}}> 
        Nenhum aluno cadastrado
      </div>
    )
  return(
    <div className="menuAlunos">
      {/*<AddIcon color='#358bff' />*/}
      {
      alunos.map((entidade, index) => (
        <Aluno key={`aluno-${index}`} nome={entidade.name} dispositivos={entidade.devices.length} ultimaConexao={timeDiff(entidade.devices[0].updatedAt)} onClick={()=>{handleSelectStudent}} onClick={()=>handleSelectStudent(entidade.id)}/>
      ))
      }
      {/*<SearchAluno />*/}
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

      if(diff <= 0)
        setTimeLeft(`00:00`);
      else
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
      <h5><div style={{color:'black'}}>{timeIsExpired?'O código expirado':'O código expira em'} <span style={timeLeft.startsWith('00') ? {color:'#ff8080'}:{}}>{timeLeft}</span> </div> </h5>
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
      Para vincular um aluno à instituição, clique em "Gerar código". Após isso, insira o código na tela de configurações da app
    </p>
    {/*<p>
    Próximo passo:<br/>
    O código deverá ser inserido diretamente no aplicativo móvel para concluir a vinculação automática à instituição.
    </p>*/}
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
        {/*<CloseMenu onClick={close} />*/}
        {code?<Code code={code} target={expiresAt}/>:<Information/>}
        
        <Button onClick={handleGenerateCode}>Gerar código</Button>
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
  const [isAddingStudent, setIsAddingStudent] = useState(false)

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
    const[uninstall, setUninstall] = useState(false);
    const {showAlert} = useAlert();
    
    async function handleCurrentStudent(id){
      let obj = await fetch("/api/student?q="+id);
      let resp = await obj.json()

      setAluno(resp)
    }

    useEffect(()=>{
      const interval = setInterval(()=>{
        if(aluno) handleCurrentStudent(aluno.id);
      }, 5000)

      return ()=>clearInterval(interval);
    }, [])

    async function changeUninstall(){
      let obj = await fetch("/api/student", {
        method: "PUT",
        "Content-Type": "application/json",
        body: JSON.stringify({student: {id: aluno.id, uninstall: aluno.uninstall}})
      })

      let res = await obj.json();

      if(res.success) showAlert("Estado da desinstalação mudado")
    }

    function timeDiff(before){
    let agr = new Date();
    let bf = new Date(before)
    let d = agr - bf;
    let sem = Math.floor(d / (1000 * 60 * 60 * 24 * 7))
    let day = Math.floor(d / (1000 * 60 * 60 * 24))
    let h = Math.floor(d / (1000 * 60 * 60))
    let m = Math.floor(d / (1000 * 60))
    let s = Math.floor(d / (1000))

    let diff = "há ";

    if(sem > 0)
      diff+=sem + " semana(s)"
    else if(day > 0)
      diff += day + " dia(s)"
    else if(h>0)
      diff+=h + " hora(s)"
    else if(m>0)
      diff+=m + " minuto(s)"
    else{
      diff+= s + " segundo(s)"
    }
    return diff;
    }

    function timeDiffYear(before){
      let agr = new Date();
      let tmp_bf = before.split("/");
      let bf = new Date(tmp_bf[2] + "-" + tmp_bf[1] + "-" + tmp_bf[0]);

      let d = agr.getFullYear() - bf.getFullYear()
      if(agr.getMonth() < bf.getMonth())
        d--
      else if(agr.getMonth() == bf.getMonth() && agr.getDate() < bf.getDate())
        d--
      else{

      }

      return d
    }

    function timeDiffDay(before){
      let agr = new Date();
      let bf = new Date(before);

      let d = agr - bf;


      return Math.floor(d / (1000 * 60 * 60 * 24))
    }

    return(
      <>
      <CloseMenu onClick={() => setAluno(null)}/>
      { aluno ? 
        <div className="subMenuAluno">
          <div className="subMenuAlunoIcon">
            <StudentIcon color="white" fill={true}/>
          </div>
          <h3>{aluno.name}</h3>
          {aluno.uninstall && <h6 style={{color: "#ff8080"}}>Por desinstalar</h6>}
          <div className="subMenuAlunoInfo">
            {/*<span>Turma: {aluno[0].turma}</span>*/}
            <span>Idade: {timeDiffYear(aluno.birthday)} anos</span>
            <span>Actividade: <small className="subMenuAlunoInfoActividade">{timeDiffDay(aluno.devices[0].updatedAt) <= 5 ? "Normal" : timeDiffDay(aluno.devices[0].updatedAt) <= 7 ? "Alerta" : "Suspeito"}</small></span>
          </div>
          <h5>- Dispositivos -</h5>
          <section className="devicesList">
            {
            aluno.devices.map((elemento, index) => {
              return(
                <Dispositivo key={"dispositivo"+index} modelo={elemento.model} conexao={timeDiff(elemento.updatedAt)} />
              );
            })
            }
          </section>
          <Confirm visible={uninstall} text={aluno.uninstall ? "Desabilitar desinstalação?" : "Habilitar desinstalação?"} onCancel={()=>setUninstall(false)} onOk={changeUninstall}/>
          <div 
            style={{
              position: "fixed", 
              bottom: 10, 
              right: 20,
              background: "white",
              height: "fit-content",
              padding: "7px",
              borderRadius: 100,
              boxShadow: "0 0 8px 0.5px rgb(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
          }}
            onClick={()=>setUninstall(!uninstall)}
          > 
            {uninstall ?  <CloseIcon/> : <DeleteIcon color={"#ff8080"}/>}
          </div>
        </div>
        : <EmptyMenu text="Nenhum aluno seleccionado" />
      }
      
      </>
    );
  }

  return(
    <>
    <div id="alunosPage">
      {/*<AddIcon color='#358bff' onClick={()=>setIsAddingStudent(true)}/>*/}
      { aluno ? <SubMenuAluno /> : <MenuAlunos setAluno={setAluno}/>}
    </div>

    <div id="alunosPageDesktop">
      <div className="menuAlunosDesktop">
        {/*<SearchAlunoDesktop />*/}
        <MenuAlunos setAluno={setAluno}/>
      </div>
      <div className="subMenuAlunoDesktop">
        {<SubMenuAluno/>}
      </div>
    </div>
    <div 
      style={{
        position: "fixed", 
        bottom: 60, 
        right: 20,
        background: "white",
        height: "fit-content",
        padding: "5px 7px",
        borderRadius: 100,
        boxShadow: "0 0 8px 0.5px rgb(0, 0, 0, 0.2)"
      }}
      onClick={()=>setIsAddingStudent(!isAddingStudent)}
    > 
      <StudentAddIcon color={"#358bff"}/>
    </div>
    {isAddingStudent && <SubMenuAddStudent />}
    
    </>
  );
}
