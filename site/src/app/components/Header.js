"use client";
import "@styles/Header.css";
import {useState} from "react";
export default function Header(){
  const [visible, setVisible] = useState(false);
  return(
    <div className="Header">
      <div className="headerConteiner">
        <img src={"/img/internet.svg"}/>
        <span>BlockED</span> 
      </div>
      <div className="headerConteiner" id="headerMenuController">
        <img src="/img/close.svg" style={visible ? {display: "inline"}: {display: "none"}} onClick={()=>setVisible(false)}/>
        <img src="/img/menu.svg" style={visible ? {display: "none"}: {display: "inline"}} onClick={()=>setVisible(true)}/>
      </div>
    </div>
  );
}

