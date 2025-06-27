"use client";
import "./page.css";
import { StudentsIcon, SmartPhoneIcon, AndroidIcon, SiteIcon } from "@/Icons.jsx";
import { useEffect, useState } from "react";
//import { TentativasMenu,DetalhesMenu,AppsMenu } from "@/components/main/Charts";
//import { getDayOfWeek } from "@lib/helpers.js";
import AlunosMenu from "@/components/main/AlunoMenu";
import { useAlert } from "@/context/AlertContext";
import Notifications from "@components/Notifications";
import dynamic from 'next/dynamic';
import LoadingLineChartSkeleton from "@/skeletons/LoadingLineChartSkeleton"
import LoadingBarChartSkeleton from "@/skeletons/LoadingBarChartSkeleton"
import LoadingDoughChartSkeleton from "@/skeletons/LoadingDoughChartSkeleton"
import NoChartDataSkeleton from "@/skeletons/NoChartDataSkeleton"
import 'chart.js/auto';

function lineLabels(){
  let daysShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  let now = new Date();
  let static_now = new Date();
  let static_yesterday = new Date();
  static_yesterday.setDate(static_yesterday.getDate() - 1);
  let response = [];

  for(let i = 0; i < 7; i++){
    if(i != 0) now.setDate(now.getDate() - 1)
    else{

    }

    if(now.getDay() == static_now.getDay()) response = ["Hoje", ...response]
    else if(now.getDay() == static_yesterday.getDay()) response = ["Ontem", ...response]
    else{
      response = [daysShort[now.getDay()], ...response];
    }
  }

  return response;
}

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
      ssr: false,
    });
    
    const optionsDoughnut = {
        plugins: {
          legend: {
      display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      };

      const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
      ssr: false,
    });
  
    
    
    const optionsLine = {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Tentativas de acesso",
          color: "#358bff",
          fill: "black"
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#3598ff"
          },
          grid: {
            display: false
          },
          border: {
      color: "#3598ff"
          }
        },
        y: {
          ticks:{
            color: "#3598ff"
          },
          grid: {
            display: false
          },
          border: {
            display: true,
      color: "#35b8ff"
          },
          beginAtZero: true
        }
      }
    };

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
      ssr: false,
    });
    
    
    

export function DetalhesMenu({data, loading}){
  const dataDoughnut = {
      labels: [
        'Normal',
        'Alerta',
        'Suspeito'
      ],
      datasets: [{
        label: "",
        data: data,
        backgroundColor: [
          '#00cc00',
          '#f9f900',
          '#ee8080'
        ],
        borderWidth: 3,
        borderRadius: 6
      }]
    };

    function DoughnutTit(props){
        return(
      <div className="homeDoughnutTit">
        <div className="quad" style={{background: props.color}}></div>
        <span>{props.text}</span>
      </div>
        );
      }
      
      if(loading) return <LoadingDoughChartSkeleton/>
      if(data[0] == 0 && data[1] == 0 && data[2] == 0) return <NoChartDataSkeleton/>
      return(
        <div className="homeDoughnut">
      <h5>Actividade dos alunos</h5>
          <div className="homeDoughnutConteiner">
        <Doughnut data={dataDoughnut} options={optionsDoughnut} />
          </div>
          <div className="homeDoughnutTits">
        <DoughnutTit color="#00cc00" text="Normal" />
        <DoughnutTit color="#f9f900" text="Alerta" />
        <DoughnutTit color="#ee8080" text="Suspeito" />
          </div>
        </div>
      );
}
  
export function TentativasMenu({data, loading}){
  const dataLine = {
      labels: lineLabels(),
      datasets: [
        {
          label: 'Tentativas de acesso',
          data: data,
          fill: false,
          borderColor: '#55abff',
          tension: 0.3,
          fill: true,
          backgroundColor: "#358bff22",
          borderColor: '#358bff',
          tension: 0.1,
          borderWidth: 1.5,
          pointStyle: "circle",
          pointBorderWidth: .9
        },
      ],
    };   
    
      if(loading) return <LoadingLineChartSkeleton />
      if(data[0] == 0 && data[1] == 0 && data[2] == 0 && data[3] == 0 && data[4] == 0 && data[5] == 0 && data[6] == 0) return <NoChartDataSkeleton/>
      return(
        <Line data={dataLine} options={optionsLine}/>
      );
}

export function AppsMenu({data, labels, loading}){
  const optionsBar = {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Apps mais tentados",
          color: "#358bff",
          fill: "black"
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#3598ff"
          },
          grid: {
            display: false
          },
          border: {
      color: "#3598ff"
          }
        },
        y: {
          ticks:{
            color: "#3598ff"
          },
          grid: {
            display: false,
      color: "#358bff"
          },
          border: {
            display: true,
      color: "#35b8ff"
          },
          beginAtZero: true
        }
      }
    }
    
    const dataBar = {
      labels: labels,
      datasets: [
        {
          label: 'Apps mais tentados dos últimos dias',
          data: data,
          backgroundColor: ["#358bff"],
          borderColor: ["#eee"],
          borderWidth: 0,
          borderRadius: 5,
        },
      ],
    };
    
    if(loading) return <LoadingBarChartSkeleton/>
    if((data[0] == 0 && data[1] == 0 && data[2] == 0 && data[3] == 0) || (data[0] == 0 && data[1] == 0 && data[2] == 0 && data.length == 3) || (data[0] == 0 && data[1] == 0 && data.length == 2) || (data[0] == 0 && data.length == 1)) return <NoChartDataSkeleton/>
    return(
      <Bar data={dataBar} options={optionsBar}/>
    );
}

function HeaderCard(props){
  
  return(
    <div className="headerCard" >
     <div className="headerCardIconConteiner">
      {props.icon}
      {props.value >= 1000 ? props.value : props.value >= 100 ? props.value : props.value >= 10 ? "0"+props.value : "00"+props.value}
     </div>
     <span>{props.text}</span>
    </div>
  )
}

function OverviewOption(props){
  return(
    <div className="overviewOption" style={props.menu == props.overviewMenu ? {background: "white", color: "#404040"} : {}} onClick={props.onClick && props.onClick}>
    {props.text}
    </div>
  );
}

function HomePageHeader({totalAlunos, totalDispositivos,totalApps,totalSites}){
  return(
    <div className="homePageHeader">
<HeaderCard icon={<StudentsIcon color="#358bff"/>} value={totalAlunos} iconBg="#358bff" text="Alunos" />
<HeaderCard icon={<SmartPhoneIcon color="#358bff"/>} value={totalDispositivos} iconBg="#358bff" text="Dispositivos" />
<HeaderCard icon={<AndroidIcon color="#358bff"/>} iconBg="#358bff" value={totalApps} text={"Apps"} />
<HeaderCard icon={<SiteIcon color="#358bff"/>} iconBg="#358bff" value={totalSites} text={"Sites"} />
    </div>
  );
}

function MainGraphConteiner({alunos, overviewMenu, lineData, doughData, barData, barLabels, loading}){
    return(
      <div className="homeOverview">
        {
    overviewMenu == "tentativas" ?
    <TentativasMenu  data={lineData} loading={loading}/> :
    overviewMenu == "apps" ?
    <AppsMenu data={barData} labels={barLabels} loading={loading}/> :
    overviewMenu == "alunos" ?
          <AlunosMenu alunos={alunos} /> :
          overviewMenu == "detalhes" ?
          <DetalhesMenu data={doughData} loading={loading}/> :
    null
           
        }
      </div>
    );
  }

export default function Home() {
  
  //Constantes
  const [message, setMessage] = useState('ola')
  const [overviewMenu, setOverviewMenu] = useState("tentativas");
  const [alunos, setAlunos] = useState([]);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [totalDispositivos, setTotalDispositivos] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const [totalSites, setTotalSites] = useState(0);
  const [lineData, setLineData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [doughData, setDoughData] = useState([0, 0, 0]);
  const [barLabels, setBarLabels] = useState(["", "", "", ""]);
  const [barData, setBarData] = useState([0, 0, 0, 0]);
  const {showAlert} = useAlert();
  const [loading, setLoading] = useState(true);

  function Overview(){ 
    return(
      <div className="overviewTit">
	<h4>Visão geral</h4>
        <div className="overviewOptions">
          <OverviewOption text="Tentativas" menu="tentativas" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("tentativas")}/>
          <OverviewOption text="Apps" menu="apps" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("apps")}/>
          <OverviewOption text="Alunos" menu="alunos" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("alunos")}/>
          <OverviewOption text="Detalhes" menu="detalhes" overviewMenu={overviewMenu} onClick={()=>setOverviewMenu("detalhes")}/>
	</div>
      </div>
    );
  }  

  
   
  useEffect(()=>{
    const controller = new AbortController()
    let isActive = true

    async function fetchData(){
        while(isActive){
          try{
            const response = await fetch('/api/dashboard/', {
              signal: controller.signal
            })

            const data = await response.json()
      
            setTotalApps(data.apps)
            setTotalSites(data.sites)
            setTotalAlunos(data.students)
            setTotalDispositivos(data.devices)
            setLineData(data.days)
            setDoughData([data.normalSt, data.alertSt, data.suspectSt])
            setBarData(data.appAttemptsData)
            setBarLabels(data.appAttemptsLabel)
            setLoading(false);
          } catch(error){

          } finally {

          }

          await new Promise((resolve)=>setTimeout(resolve, 5000))
        }
    }

    fetchData()
    //const interval = setInterval(()=>fetchData(), 10000)

    return ()=>{
      isActive = false
      controller.abort()
    }
  }, [])

  useEffect(()=>{
    //showAlert("Nothing")
    console.log(lineLabels())
  }, [])


  useEffect(()=>{
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
  }, [])

  
  return (
    <>
    {/* Moblie */}
    <div className="homePage">
      <HomePageHeader totalAlunos={totalAlunos} totalApps={totalApps} totalDispositivos={totalDispositivos} totalSites={totalSites} />
      <Overview />
      <div id="homePageContent">
        <MainGraphConteiner loading={loading} alunos={alunos} overviewMenu={overviewMenu} lineData={lineData} doughData={doughData} barData={barData} barLabels={barLabels}/>
      </div>
    </div>

    {/* Desktop */}
    {/*<div>{message}</div>*/}
    <div className="homePageDesktop">
      <HomePageHeader  totalAlunos={totalAlunos} totalApps={totalApps} totalDispositivos={totalDispositivos} totalSites={totalSites} />
      <div className="desktopGraphConteiner">
        <section> <TentativasMenu data={lineData} loading={loading}/> </section>
        <section> <AppsMenu data={barData} labels={barLabels} loading={loading}/> </section>
      </div>
      <div className="othersConteiner">
        <section className="section1"><AlunosMenu alunos={alunos} /></section>
        <section className="section2"><DetalhesMenu data={doughData} loading={loading}/></section>
      </div>
    </div>
    {/*<Notifications />*/}
    </>
  );
}
