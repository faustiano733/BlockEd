import { Op } from "sequelize";
import apps from "../db/models/apps.js";
import gplay from "google-play-scraper"

export async function pegarTodosApps(){
    const lista_apps = await apps.findAll({attributes:{exclude:"id"}})
    return lista_apps
}

export async function pegarApp(app_nome){

    const app_encontrado = await apps.findOne({
        where:{
        nome:app_nome
        },
        attributes:{
            exclude:"id"
        }})

    return app_encontrado
}


export async function sugerirApps(app_nome){
    const lista_apps = await gplay.search({term:app_nome, num:5})
    const lista_nome_apps = lista_apps.map((app)=>{
        return {nome:app.title}
    })
    return lista_nome_apps
}

export async function adicionarApp(nome_app){
   
    const lista_gplay_apps = await gplay.search({term:nome_app,num:3})
   
    let lista_gplay_apps_filtrada = lista_gplay_apps.filter((app_gplay)=>app_gplay.title===nome_app)
   
    if(lista_gplay_apps_filtrada != [] && lista_gplay_apps_filtrada.length < 2){
        
        const [ app ] = lista_gplay_apps_filtrada
        
        const app_adicionado = await apps.create({nome:app.title,package_name:app.appId, escola_id:1})
        
        return app_adicionado
    }else{
         throw new Error("Alguma coisa errada aconteceu")
    }
}

export async function activarApp(dados_app_nome){
    const app_selecionado = await apps.findOne({
        where:{
            nome:dados_app_nome
        }
    })

    const app_editado = await apps.update({
        where:{
            ativado:!(app_selecionado.ativado)
        }
    })
    return app_editado

}

export async function deletarApp(app_nome){
    const app_encontrado = await pegarApp(app_nome);
    await apps.destroy({
        where:{
            nome:app_encontrado.nome
        }
    })
    
}

//const teste = await sugerirApps("whatsapp")
//console.log(teste)

await adicionarApp('WhatsApp Messenger')