import { Op } from "sequelize";
import { apps } from "../db/models//apps.js";
import gplay from "google-play-scraper"

export async function getAllApps(){
    const all_apps_list = await apps.findAll()
    return all_apps_list
}

export async function getApp(app_name){

    const finded_app = await apps.findOne({
        where:{
        name:app_name
        },
        attributes:{
            exclude:"idApp"
        }})

    return finded_app
}


export async function sugestApps(app_name){
    const suggest_apps_list = await gplay.search({term:app_name, num:5})
    const apps_name = suggest_apps_list.map((app)=>{
        return {name:app.title}
    })
    return apps_name
}

export async function addApp(app_name){
   
    const gplay_apps = await gplay.search({term:app_name,num:3})
   
    let selected_gplay_app = gplay_apps.filter((app_gplay)=>app_gplay.title===nome_app)
   
    if(selected_gplay_app != [] && selected_gplay_app.length < 2){
        
        const [ app ] = selected_gplay_app
        
        const added_app = await apps.create({name:app.title,package_name:app.appId, idSchool:1})
        
        return added_app
    }else{
         throw new Error("impossible add app")
    }
}

export async function activeApp(app_name){
    const finded_app = await apps.findOne({
        where:{
            name:app_name
        }
    })

    const actived_app = await apps.update({
        where:{
            active:!(finded_app.ativado)
        }
    })
    return actived_app

}

export async function deleteApp(app_name){
    const finded_app = await getApp(app_name);
    await apps.destroy({
        where:{
            nome:finded_app.nome
        }
    })
    
}


export async function getNumberOfApps(){
    const number_of_apps = await apps.count()
    return number_of_apps
}
//const teste = await sugerirApps("whatsapp")
//console.log(teste)

//await adicionarApp('WhatsApp Messenger')