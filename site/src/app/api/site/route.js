import { NextResponse } from "next/server";
import { adicionarSite, apagarSite, editarSite, pegarSite, pegaTodosSites } from "../../services/siteServices.js";

export async function GET() {
    const todos_sites =  await pegaTodosSites()
    return NextResponse.json(todos_sites);
}

export async function DELETE(request){
    const dados = await request.json();
    const site = await pegarSite(dados.dominio);
    apagarSite(site);
    
}

export async function PUT(request){

    const [dados_site_antigos, dados_site_novos] = await request.json();
    dados_site_antigos = await pegarSite(dados_site_antigos.nome);
    const site_editado = await editarSite({...dados_site_novos,id:dados_site_antigos});
    
    return NextResponse.json(site_editado);
}

export async function POST(novo_site){
    const site_criado = await criarSite(novo_site);
    return NextResponse.json(site_criado);
    
}