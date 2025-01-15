import { pegaInformacoesAluno, pegarAlunos } from "@/app/services/alunoService.js";
import { getBlocksWeek, pegaAppsTentados } from "../../services/tentativaServices.js";
import { NextResponse } from "next/server.js";


export async function GET(req){
    const url = new URL(req.url)
    let resposta = ""
    
    const tentativas_semana = await getBlocksWeek()
    resposta = tentativas_semana
    
    return NextResponse.json(resposta)    
}