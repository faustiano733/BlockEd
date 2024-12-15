import { NextResponse } from "next/server";
import { associarDispositivo, criarAluno, pegarAlunos } from "../../services/alunoService";


export async function GET(){
    const todos_alunos = await pegarAlunos()
    return NextResponse.json(todos_alunos)
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