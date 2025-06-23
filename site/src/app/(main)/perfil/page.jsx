"use client";
import 'leaflet/dist/leaflet.css';
import Image from "next/image";
import {useRouter} from "next/navigation";
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
import MapaComRaio from "@/components/MapaComRaio";
import { useAlert } from "@/context/AlertContext";
import Notifications from "@components/Notifications";

function LocationMenu(){
  const [locationData, setLocationData] = useState({ 
    latitude: -8.8383, 
    longitude: 13.2344, 
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

    setChangeLocationLoading(false)
  }

  return (
    <>
    <div style={{ maxWidth: '1200px', margin: '0 auto',height:'70%' }}>
      <h1 className="titulo-mapa">Marque a localização da escola</h1>
      <MapaComRaio className='mapa-wrapper' onChange={handleLocationChange} initialPosition={{lat:locationData.latitude,lng:locationData.longitude}} initialRadius={locationData.radius} />
    </div>
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
  <Button onClick={() =>{setChangeLocationLoading(true);handleSubmit()}}>
	       {changeLocationLoading ? <>Alterando<PendingIcon color="#fff"/></> : <><small>Confirmar</small></>}
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
 if(!(exceptions.length >= 1)) return <EmptyMenu text='Nenhuma excepção adicionada'/>
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
  const [subMenu, setSubMenu] = useState('');
  const { showAlert } = useAlert();

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
	<ProfileOption text="Gerir senha e exceções" onClick={()=> setSubMenu("senha")} icon={<LockIcon color="#358bff" />}/>
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
        <Input onChange={handlechangeName} type='text' label='nome do usuario'></Input>
        <Input type="password" label="Senha antiga"/>
        <Input type="password" label="Nova senha"/>
        <Button onClick={() =>{setChangePassLoading(true); changePass()}}>
	       {changePassLoading ? <>Alterando <PendingIcon color="#fff"/></> : <><small>Confirmar</small></>}
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
        {subMenu ? <SubMenu /> : <> <Header user={user} school={school} /> <Content /> </>}
      </div>
      <div className="mainDesktop">
        <div className="profileSettingsDesktop">
          <Header user={user} school={school} />
          <Content />
        </div>
        <div className="profileScreenDesktop">
          {subMenu === 'senha' && <SenhaMenu />}
          {subMenu === 'location' && <LocationMenu />} {/* Substitua LocationMenu por Location */}
        </div>
      </div>
      {/*<div onClick={()=>{showAlert("Bruh2mnjdhfdgjfhdhgfhdfdhfdjgfjgdhjfgdgfhdghfdgfdgf")}}>Clique</div>*/}
      <Notifications />
    </>
  );
}