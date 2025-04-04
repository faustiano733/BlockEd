"use client";
import Image from "next/image";
import "./page.css";
//import {Aluno} from "./alunos/page.js";
import { LockIcon, CalendarIcon, CalendarAddIcon, LocationIcon, CloseIcon, ForwardIcon, ProfileIcon, StudentIcon, DeleteIcon, LogoutIcon, StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon, PendingIcon, AddIcon } from "@icon";
import { useEffect, useState } from "react";
import Button from "@components/Button.js";
import Input from "@components/Input.js";
import Confirm from "@components/Confirm.js";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { EmptyMenu } from "../bloqueio/page";

function ExceptionSection(){
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
  const [exceptions,setExceptions] = useState([])

  

  useEffect(()=>{
    async function fetchData(){
      const response = await fetch('/api/exception')
      const dados = await response.json()
      setExceptions(dados)
    }

    fetchData()
    const interval = setInterval(()=>fetchData(),2500)
    return ()=>clearInterval(interval)
  },[])
 if(!(exceptions.length >= 1)) return <EmptyMenu text='Nenhuma Excepção Adicionada'/>
 return (<section className="excecoesSection">
    {exceptions.map((exception,index)=>(
      <Excecao id={exception.id} key={`exception-${index}`}>{meses[new Date(exception.date).getMonth()]}{' '}{new Date(exception.date).getDate()}</Excecao>
    ))}
  </section>)
}

function Excecao({children,id}){
  const [isDeleting, setIsDeleting] = useState(false)
  async function handleDeleteException(id){
    setIsDeleting(true)
    await fetch('/api/exception',{
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      method:'DELETE',
      body:JSON.stringify({exception:id})
    })
    setTimeout(()=>setIsDeleting(false),2500)
    
  }
  return(
    <div className="excecao">
      <CalendarIcon color="#358bff"/>
      <span>{children}</span>
      {isDeleting?<PendingIcon/>:<DeleteIcon color="#ff8080" className="excecaoDelIcon" onClick={async ()=>await handleDeleteException(id)}/>}
    </div>
  );
}

function Header({user, school}){
  return(
    <div className="profileHeader">
<div className="profileHeaderImg">
  <StudentIcon color="white" fill/>
 </div>
<div className="profileHeaderTxt">
  <h3>{user}</h3>
  <h6>{school}</h6>
</div>
    </div>
  );
}

function ProfileOption(props){
  return(
    <div id={props.id ? props.id : ""} className="profileOption" onClick={props.onClick && props.onClick}>
{props.icon ? props.icon : <ForwardIcon color="#358bff"/>}
<span>{props.text}</span>
    </div>
  );
}

function AddExcecaoSection({setShow}){
  const[mes, setMes] = useState(0);
  const[maxDia, setMaxDia] = useState(31);
  const[dia, setDia] = useState(31);
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const limites = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  function changeMes(subir){
    if(subir){
      if(mes <= 10){
        setMes(mes+1)
        setMaxDia(limites[mes+1])
        if(dia > limites[mes+1])
          setDia(limites[mes+1])
      }
    }
    else{
      if(mes > 0){
        setMes(mes-1)
        setMaxDia(limites[mes-1])
        if(dia > limites[mes-1])
          setDia(limites[mes-1])
      }
    }
  }

  function changeDia(subir){
    if(subir){
      if(dia < maxDia){
        setDia(dia+1);
      }
    }
    else{
      if(dia > 1){
        setDia(dia-1)
      }
    }
  }

  async function handleAddException(){
    const actualDate = new Date()
    const exception = new Date(actualDate.getFullYear(), mes, dia)

    const response = await fetch('/api/exception/',{
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      method:'POST',
      body: JSON.stringify({date:exception})

      
    })
    const data = await response.json()
    const {error} = data
    if(error) alert(`Alguma Coisa Correu Mal ${error}`)
    setShow(false)
  }
  return(
    <div className="addExcecaoSection">
      <div className="addExcecaoEl">
        <big onClick={()=>changeMes(false)}>-</big>
        <span>{meses[mes]}</span>
        <big onClick={()=>changeMes(true)}>+</big>
      </div>
      <div className="addExcecaoEl" >
        <big onClick={()=>changeDia(false)}>-</big>
        <span>{dia}</span>
        <big onClick={()=>changeDia(true)}>+</big>
      </div>
      <CalendarAddIcon color="#358bff" onClick={handleAddException}/>
    </div>
  );
}

function CloseMenu(props){
  return(
    <div className="closeMenu">
      <CloseIcon onClick={props.onClick && props.onClick} />
    </div>
  );
}

export default function Profile() {
  const [user, setUser]  = useState('')
  const [school, setSchool] = useState('')
  const [subMenu, setSubMenu] = useState(null);
  function deletarConta(){
    alert(1);
  }

  
  
  function Content(){
    const[delAccount, setDelAccount] = useState(false);
    const[logoutLoading, setLogoutLoading] = useState(false);

    async function logout(){
      setTimeout(()=>setLogoutLoading(false), 2000);
      await fetch('/api/logout',{
        method:'POST'
      })
    }
    return(
      <>
      <div className="profileContent">
	<ProfileOption text="Gerir senha e exceções" onClick={()=> setSubMenu("senha")} icon={<LockIcon color="#358bff" />}/>
	<ProfileOption text="Alterar localização da instituição" icon={<LocationIcon color="#358bff" />}/>
	<ProfileOption text="Deletar conta" icon={<DeleteIcon color="#358bff" />} onClick={()=> setDelAccount(true)}/>
	<ProfileOption id="logoutButton" text="Terminar sessão" icon={logoutLoading ? <PendingIcon color="#ff8080" /> : <LogoutIcon color="#ff8080" />} onClick={()=>{setLogoutLoading(true); logout()}}/>
      </div>
      <Confirm visible={delAccount} text="Deletar Conta?" onCancel={()=>setDelAccount(false)} />
      </>
    );
  }
  function SenhaMenu(){
    const [changePassLoading, setChangePassLoading] = useState(false);
    const [showAddExcecao, setShowAddExcecao] = useState(false);

    async function changePass(){
      setTimeout(()=>{
        setChangePassLoading(false);
      }, 3000)
    }

    function ExcecaoTit(){
      return(
        <div className="excecaoTit">
          <h5>Exceções</h5>
          {
          showAddExcecao ?
          <CalendarIcon color="#358bff" onClick={()=>setShowAddExcecao(false)}/>
          :
          <CalendarAddIcon color="#358bff" onClick={()=>setShowAddExcecao(true)}/>
          }
        </div>
      );
    }

    return(
      <div className="profileSubMenu" id="senhaMenu">
        <Input type='text' label='nome do usuario'></Input>
        <Input type="password" label="Senha antiga"/>
        <Input type="password" label="Nova senha"/>
        <Button onClick={() =>{setChangePassLoading(true); changePass()}}>
	       {changePassLoading ? <PendingIcon color="#fff"/> : <><small>Confirmar</small></>}
        </Button>
        <ExcecaoTit />
        {
        showAddExcecao ?
        <AddExcecaoSection setShow={setShowAddExcecao}/>
        :
        <ExceptionSection />
      }
      </div>
    );
  }

  function SubMenu(){
    if(subMenu == "senha") return(
      <>
      <CloseMenu onClick={()=> setSubMenu(null)}/> 
      <SenhaMenu />
      </>
    );
  }

  useEffect(()=>{
    async function fetchData(){
      const response = await fetch('/api/user/')
      const {user, school} = await response.json()
      setSchool(school.name)
      setUser(user.name)
    }
    fetchData()
  },[])
  
  return (
    <>
    <div className="main">
      { subMenu ? <SubMenu /> : <> <Header user={user} school={school} /> <Content /> </> }
    </div>
    <div className="mainDesktop">
      <div className="profileSettingsDesktop">
        {user===''?<Loading/> :<Header user={user} school={school} />}
        <Content />
      </div>
      <div className="profileScreenDesktop">
        <SenhaMenu />
      </div>
    </div>
    </>
  );
}