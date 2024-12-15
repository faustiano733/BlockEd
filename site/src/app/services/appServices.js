import { Op } from "sequelize";
import apps from "../db/models/apps.js";


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


export async function adicionarApp(novo_app){
    const app_adicionado = await apps.create(novo_app)
    return app_adicionado
}

export async function editarApp(dados_apps_novo){

    const app_editado = await apps.update({
        where:{
            nome:dados_apps_novo.nome
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