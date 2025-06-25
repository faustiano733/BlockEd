"use client";
import 'leaflet/dist/leaflet.css';
import Image from "next/image";
import {useRouter} from "next/navigation";
import "./page.css";
//import {Aluno} from "./alunos/page.js";
import { LockIcon, CalendarIcon, CalendarAddIcon, LocationIcon, CloseIcon, ForwardIcon, ProfileIcon, StudentIcon, DeleteIcon, LogoutIcon, StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon, PendingIcon, AddIcon, NotificationIcon } from "@icon";
import { useEffect, useState } from "react";
import Button from "@components/Button.js";
import Input from "@components/Input.js";
import Confirm from "@components/Confirm.js";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";
import { EmptyMenu } from "../bloqueio/page";
import MapaComRaio from "@/components/MapaComRaio";
import { useAlert } from "@/context/AlertContext";
import Notifications from "@components/Notifications";
import NoExceptionSkeleton from "@/skeletons/NoExceptionSkeleton"

function LocationMenu(){
  const [initialLoading, setInitialLoading] = useState(true);
  const { showAlert } = useAlert();
  const [locationData, setLocationData] = useState({ 
    latitude: 0,//-8.8383, 
    longitude: 0,//13.2344, 
    radius: 500 
  });


  const handleLocationChange = ({ lat, lng, radius }) => {
    setLocationData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      radius: radius
    }));
  };

  const [changeLocationLoading, setChangeLocationLoading] = useState(false)
  useEffect(()=>{
    async function fetchData(){
      const response = await fetch('/api/location')
      const dados = await response.json()
      setLocationData({latitude:parseFloat(dados.latitude), longitude:parseFloat(dados.longitude), radius:dados.radius})
      //await new Promise( resolve => setTimeout(resolve, 1000))
      setInitialLoading(false)
    }

    fetchData()
  },[])

  const handleSubmit = async ()=>{
    const response = await fetch('/api/location',{
      headers:{
        'Content-Type':'application/json'
      },
      method:'PUT',
      body:JSON.stringify({location:{
        ...locationData,
        longitude:locationData.longitude.toString(),
        latitude:locationData.latitude.toString()
      }})
    })

    if(response.ok)
      showAlert("Localização alterada com sucesso")
    else{
      showAlert("Erro ao alterar localização")
    }

    setChangeLocationLoading(false)
  }

  return (
    <>
    <div style={{width: "100%", margin: '0 auto',maxHeight:'60%', height: "60%", display: "flex", flexDirection: "column", gap: 10}}>
      { initialLoading ? <Loading /> :
        <>
          <h4 className="titulo-mapa">Marque a localização da escola</h4>
          <MapaComRaio className='mapa-wrapper' onChange={handleLocationChange} initialPosition={{lat:locationData.latitude,lng:locationData.longitude}} initialRadius={locationData.radius} />
        </>
      }
    </div>
    {/*
    <div className="dados-localizacao">
    <h3>Dados da Localização:</h3>
    <pre>
      Latitude: {locationData.latitude.toFixed(6)}
      <br />
      Longitude: {locationData.longitude.toFixed(6)}
      <br />
      Raio: {locationData.radius} metros
    </pre>
    </div>
    */}
    <Button onClick={() =>{setChangeLocationLoading(true);handleSubmit()}}>
	       {changeLocationLoading ? <><small>Confirmando...</small></> : <><small>Confirmar</small></>}
    </Button>
  </>
  );
}

function ExceptionSection(){
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
  const [exceptions,setExceptions] = useState(null)

  

  useEffect(()=>{
    async function fetchData(){
      const response = await fetch('/api/exception')
      const dados = await response.json()
      setExceptions(dados)
    }

    fetchData()
    //const interval = setInterval(()=>fetchData(),2500)
    //return ()=>clearInterval(interval)
  },[])
  if(!exceptions) return <Loading />
 if(!(exceptions.length >= 1)) return <NoExceptionSkeleton/>
 return (<section className="excecoesSection">
    {exceptions.map((exception,index)=>(
      <Excecao id={exception.id} key={`exception-${index}`}>{meses[new Date(exception.date).getMonth()]}{' '}{new Date(exception.date).getDate()}</Excecao>
    ))}
  </section>)
}

function Excecao({children,id}){
  const [isDeleting, setIsDeleting] = useState(false)
  const { showAlert } = useAlert();
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

    showAlert("Exceção deletada com sucesso")
    setIsDeleting(false)
    
  }
  return(
    <div className="excecao">
      <CalendarIcon color="#358bff"/>
      <span>{children}</span>
      {isDeleting?<PendingIcon color="#ff8080" className="excecaoDelIcon"/>:<DeleteIcon color="#ff8080" className="excecaoDelIcon" onClick={async ()=>await handleDeleteException(id)}/>}
    </div>
  );
}

function Header({user, school}){
  return(
    <div className="profileHeader">

      {// !user || !school ? <Loading /> :
      <>
      <div className="profileHeaderImg">
        <StudentIcon color="white" fill/>
      </div>
      <div className="profileHeaderTxt">
        <h3>{user || "***"}</h3>
        <h6>{school || "***"}</h6>
      </div>
      </>
      }
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
  const { showAlert } = useAlert();
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
    if(error) showAlert("Erro ao adicionar exceção")
    else
      showAlert("Exceção adicionada com sucesso")
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
  const [subMenu, setSubMenu] = useState('');
  const { showAlert } = useAlert();
  const [showNot, setShowNot] = useState(false)

  function deletarConta(){
    alert(1);
  }

  
  
  function Content(){
    const[delAccount, setDelAccount] = useState(false);
    const[logoutLoading, setLogoutLoading] = useState(false);
    const router = useRouter();

    async function logout(){
      //setTimeout(()=>setLogoutLoading(false), 2000);
      let obj = await fetch('/api/logout',{
        method:'POST'
      })

      let res = await obj.json();
      if(res.success){
        router.replace("/login")
      }

      setLogoutLoading(false)
    }
    return(
      <>
      <div className="profileContent">
	<ProfileOption text="Gerir exceções" onClick={()=> setSubMenu("senha")} icon={<LockIcon color="#358bff" />}/>
	<ProfileOption text="Alterar localização da instituição" icon={<LocationIcon color="#358bff" />} onClick={()=>setSubMenu('location')} />
	{/*<ProfileOption text="Deletar conta" icon={<DeleteIcon color="#358bff" />} onClick={()=> setDelAccount(true)}/>*/}
	<ProfileOption id="logoutButton" text="Terminar sessão" icon={logoutLoading ? <PendingIcon color="#ff8080" /> : <LogoutIcon color="#ff8080" />} onClick={()=>{setLogoutLoading(true); logout()}}/>
      </div>
      <Confirm visible={delAccount} text="Deletar Conta?" onCancel={()=>setDelAccount(false)} />
      </>
    );
  }
  function SenhaMenu(){
    const [changePassLoading, setChangePassLoading] = useState(false);
    const [showAddExcecao, setShowAddExcecao] = useState(false);
    const [nameInput, setNameInput] = useState('')
    async function changePass(){
      const response = await fetch('/api/user',{
        headers:{
          'Content-Type':'application/json',
          'Accept':'application/json'
        },
        method:'PUT',
        body:JSON.stringify({name:nameInput.trim()})
      })
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

    function handlechangeName(e){
      setNameInput(e.target.value)
    }

    return(
      <div className="profileSubMenu" id="senhaMenu">
        {/*<Input onChange={handlechangeName} type='text' label='nome do usuario'></Input>
        <Input type="password" label="Senha antiga"/>
        <Input type="password" label="Nova senha"/>
        <Button onClick={() =>{setChangePassLoading(true); changePass()}}>
	       {changePassLoading ? <>Confirmando...</> : <><small>Confirmar</small></>}
        </Button>*/}
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
    if(subMenu == "location") return(
      <>
      <CloseMenu onClick={()=> setSubMenu(null)}/> 
      <LocationMenu />
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
        { showNot ? <Notifications/> : subMenu ? <SubMenu /> : <> <Header user={user} school={school} /> <Content /> </>}
        <div style={{position: "fixed", bottom: 30, right: 20, padding: 5, backgroundColor: "white", display: "flex", borderRadius: 100, boxShadow: "0 0 2px 0.5px rgba(0, 0, 0, 0.6)"}} onClick={()=>{
          setShowNot(!showNot)
        }}>
          <NotificationIcon size={30}/>
        </div>
      </div>
      <div className="mainDesktop">
        <div className="profileSettingsDesktop">
          <Header user={user} school={school} />
          <Content />
        </div>
        <div className="profileScreenDesktop" style={subMenu ? {} : {display: "none"}}>
          {subMenu === 'senha' && <SenhaMenu />}
          {subMenu === 'location' && <LocationMenu />} {/* Substitua LocationMenu por Location */}
        </div>
        <Notifications />
      </div>
      {/*<div onClick={()=>{showAlert("Bruh2mnjdhfdgjfhdhgfhdfdhfdjgfjgdhjfgdgfhdghfdgfdgf")}}>Clique</div>*/}
    </>
  );
}