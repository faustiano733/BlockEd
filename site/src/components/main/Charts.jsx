import dynamic from 'next/dynamic';
import 'chart.js/auto';
export function DetalhesMenu(){

    
    const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
      ssr: false,
    });
    const dataDoughnut = {
      labels: [
        'Normal',
        'Alerta',
        'Suspeito'
      ],
      datasets: [{
        label: "",
        data: [60,20, 20],
        backgroundColor: [
          '#00cc00',
          '#f9f900',
          '#ee8080'
        ],
        borderWidth: 3,
        borderRadius: 6
      }]
    };
    const optionsDoughnut = {
        plugins: {
          legend: {
      display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      };
      function DoughnutTit(props){
        return(
      <div className="homeDoughnutTit">
        <div className="quad" style={{background: props.color}}></div>
        <span>{props.text}</span>
      </div>
        );
      }
  
      return(
        <div className="homeDoughnut">
      <h5>Descrição de alunos</h5>
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
  
export function TentativasMenu(){
      
    const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
      ssr: false,
    });
  
    const dataLine = {
      labels: ["Qui", "Sex", 'Sab', 'Dom', 'Seg', 'Ontem', 'Hoje'],
      datasets: [
        {
          label: 'Tentativas de acesso',
          data: [65, 59, 80, 81, 56, 70, 100],
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
  
      return(
        <Line data={dataLine} options={optionsLine}/>
      );
}

export function AppsMenu(){
  
    const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
      ssr: false,
    });
    
    
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
      labels: ['Facebook', 'Instagram', 'TikTok', 'Whatsapp'],
      datasets: [
        {
          label: 'Apps mais tentados dos últimos dias',
          data: [25, 19, 10, 50],
          backgroundColor: ["#358bff"],
          borderColor: ["#eee"],
          borderWidth: 0,
          borderRadius: 5,
        },
      ],
    };
    
    return(
      <Bar data={dataBar} options={optionsBar}/>
    );
}