import { Aluno } from "@/app/(main)/alunos/page";
import NoStudentSkeleton from "@/skeletons/NoStudentSkeleton"
export default function AlunosMenu({alunos}){
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
  if(alunos.length == 0) return <NoStudentSkeleton />
  return(
    <div className="homePageAlunos">
<div className="homePageAlunosSection">
  { alunos.map((entidade, index)=>(
    <Aluno key={"aluno"+index} nome={entidade.name} dispositivos={entidade.devices.length} ultimaConexao={timeDiff(entidade.devices[0].updatedAt)} />)
    )
  }
</div>
<span className="homePageAlunosText">Ver mais</span>
    </div>
  );
}