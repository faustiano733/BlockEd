import { pegaTotalTentivasSemana } from "@/app/services/tentivaService.js";
import { NextResponse } from "next/server";


export async function GET(){
    const tentativas_semana = await pegaTotalTentivasSemana()
    return NextResponse.json(tentativas_semana)
}