"use client";
import Image from "next/image";
import "./page.css";
//import {Aluno} from "./alunos/page.js";
import { ProfileIcon, StudentIcon, DeleteIcon, LogoutIcon, StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon } from "../../Icons.jsx";
import { useEffect, useState } from "react";

export default function Profile() {
  function Header(){
    return(
      <div className="profileHeader">
	<div className="profileHeaderImg">
	  <StudentIcon color="white" fill/>
 	</div>
	<div className="profileHeaderTxt">
	  <h5>@ceutron</h5>
	  <small>Instituto Politécnico Dom Damião Franklin</small>
	</div>
      </div>
    );
  }
  function ProfileOption(props){
    return(
      <div id={props.id ? props.id : ""} className="profileOption">
	<span>{props.text}</span>
	{props.icon ? props.icon : <span>{">"}</span>}
      </div>
    );
  }
  function Content(){
    return(
      <div className="profileContent">
	<ProfileOption text="Alterar Senha" />
	<ProfileOption text="Alterar localização da instituição" />
	<ProfileOption text="Deletar Conta" icon={<DeleteIcon color="#00b8f5" />} />
	<ProfileOption id="logoutButton" text="Terminar Sessão" icon={<LogoutIcon color="#ff8080" />} />
      </div>
    );
  }
  return (
    <>
    <div className="main">
      <Header />
      <Content />
    </div>
    </>
  );
}
