import "./styles.css"

export function Aluno({nome}){
  return(
     <>
      <div className=" aluno flex-container">
        <div>{nome}</div>
        <div>2 dias</div>
      </div>
     </>
  )
}

export default function Home(){
  return (
    <>
    <div className="app flex-container">
      <Aluno nome="Faustiano Geraldo"/>
      <Aluno nome="Carlos Chagas"/>
      <Aluno nome="Rui Chimuco"/>
      <Aluno nome="Abravanael sobrenome"/>
    </div>
    </>
  )
}