import { Aluno } from "@/app/(main)/alunos/page";
export default function AlunosMenu({alunos}){
  return(
    <div className="homePageAlunos">
<div className="homePageAlunosSection">
  { alunos.map((entidade, index)=>(
    <Aluno key={"aluno"+index} nome={entidade.nome} dispositivos={entidade.dispositivos} ultimaConexao={entidade.ultimaConexao} />)
    )
  }
</div>
<span className="homePageAlunosText">Ver mais</span>
    </div>
  );
}