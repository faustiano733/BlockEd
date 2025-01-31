"use client";
import Image from "next/image";
import "./page.css";
//import {Aluno} from "./alunos/page.js";
import { LockIcon, CalendarIcon, CalendarAddIcon, LocationIcon, CloseIcon, ForwardIcon, ProfileIcon, StudentIcon, DeleteIcon, LogoutIcon, StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon, PendingIcon } from "@icon";
import { useEffect, useState } from "react";
import Button from "@components/Button.js";
import Input from "@components/Input.js";
import Confirm from "@components/Confirm.js";
export default function Profile() {
  const [subMenu, setSubMenu] = useState(null);
  /*const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmText, setConfirmText] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [confirmOk, setConfirmOk] = useState(null);*/


  function deletarConta(){
    alert(1);
  }

  function CloseMenu(props){
    return(
      <div className="closeMenu">
        <CloseIcon onClick={props.onClick && props.onClick} />
      </div>
    );
  }

  function Header(){
    return(
      <div className="profileHeader">
	<div className="profileHeaderImg">
	  <StudentIcon color="white" fill/>
 	</div>
	<div className="profileHeaderTxt">
	  <h3>Ceutron</h3>
	  <h6>Instituto Politécnico Dom Damião Franklin</h6>
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
  function Content(){
    const[delAccount, setDelAccount] = useState(false);
    const[logoutLoading, setLogoutLoading] = useState(false);

    async function logout(){
      setTimeout(()=>setLogoutLoading(false), 2000);
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
    
    async function changePass(){
      setTimeout(()=>{
        setChangePassLoading(false);
      }, 3000)
    }
    function ExcecaoTit(){
      return(
        <div className="excecaoTit">
          <h5>Exceções</h5>
          <CalendarAddIcon color="#358bff"/>
        </div>
      );
    }

    function Excecao(props){
      return(
        <div className="excecao">
          <CalendarIcon color="#358bff"/>
          <span>{props.date}</span>
          <DeleteIcon color="#ff8080" className="excecaoDelIcon"/>
        </div>
      );
    }
    return(
      <div className="profileSubMenu" id="senhaMenu">
        <Input type="password" label="Senha antiga"/>
        <Input type="password" label="Nova senha"/>
        <Button onClick={() =>{setChangePassLoading(true); changePass()}}>
	       {changePassLoading ? <PendingIcon color="#fff"/> : <><small>Confirmar</small></>}
        </Button>
        <ExcecaoTit />
        <section className="excecoesSection">
          <Excecao date="Jan 25" />
          <Excecao date="Jan 25" />
          <Excecao date="Jan 25" />
          <Excecao date="Jan 28" />
        </section>
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

  /*if(subMenu) return(
    <>
    <div className="main">
      <SubMenu />
    </div>
    </>
  );*/


  return (
    <>
    <div className="main">
      { subMenu ? <SubMenu /> : <> <Header /> <Content /> </> }
    </div>
    <div className="mainDesktop">
      <div className="profileSettingsDesktop">
	<Header />
        <Content />
      </div>
      <div className="profileScreenDesktop">
        <SenhaMenu />
      </div>
    </div>
    </>
  );
}
