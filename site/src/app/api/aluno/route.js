import { NextResponse } from "next/server";
import { associarDispositivo, criarAluno, pegaInformacoesAluno, pegarAlunos } from "../../services/alunoService";


export async function GET(req){
    let resposta = ""
    const url = new URL(req.url)
    
    
    const aluno = url.searchParams.get("aluno")

    if(!(!aluno)){
        const informacoes_aluno = await pegaInformacoesAluno(aluno)
        resposta = informacoes_aluno
    }else{
        const lista_alunos = await pegarAlunos()
        resposta = lista_alunos
    }


    const todos_alunos = await pegarAlunos()
    return NextResponse.json(resposta)
}

export async function POST(req){

    const dados_requesicao = await req.json()
    const novo_aluno = dados_requesicao.aluno
    const dispositivo = dados_requesicao.dispositivo

    const aluno_criado = await criarAluno(novo_aluno)

    if(!dispositivo){
        await associarDispositivo(dispositivo, aluno_criado)
    }

    return aluno_criado
}

export async function UPDATE(req){
    const dados_requesicao = await req.json()

}