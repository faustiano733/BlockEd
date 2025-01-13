import { pegaInformacoesAluno, pegarAlunos } from "@/app/services/alunoService.js";
import { pegaAppsTentados } from "../../services/tentativaServices.js";
import { NextResponse } from "next/server.js";


export async function GET(req){
    const url = new URL(req.url)
    let resposta = ""
    
    const aluno = await pegarAlunos("Faustiano")
    resposta = aluno
    return NextResponse.json(resposta)    
}