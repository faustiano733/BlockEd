import { NextResponse } from "next/server"
import { activarApp, adicionarApp, pegarApp, pegarTodosApps } from "../../services/appServices"


export async function GET(req){
    let response = ""
    const url = new URL(req.url)
    const parametros = url.searchParams.get("app")
    if(!(!parametros)){
        const app = await pegarApp(parametros)
        response = app        
    }else{
        const lista_apps = await pegarTodosApps()
        response = lista_apps
    }

    return NextResponse.json(response)
}

export async function POST(req){

    const request = await req.json()

    const nome_app = request.nome

    const app = await adicionarApp(nome_app)

    return NextResponse.json(app)

}

export async function PUT(req){

    const request = await req.json()

    const nome_app = request.nome

    const app_editado = await activarApp(nome_app)
    
    return app_editado
}

export async function DELETE(req){
    const request = await req.json()
    
}