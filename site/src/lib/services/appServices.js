import { apps } from "../db/models.js";
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

export async function suggestApps(app_name){
    const suggest_apps_list = await gplay.search({term:app_name, num:5})
    const apps_name = suggest_apps_list.map((app)=>{
        return {name:app.title}
    })
    return suggest_apps_list;
}

export async function addApp(app_name, app_package){

    const added_app = await apps.create({name:app_name, package_name:app_package, idSchool:1})
    return added_app;
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

export async function deleteApp(appName){
    await apps.destroy({where:{nome:appName}})
}

export async function getNumberOfApps(){
    const number_of_apps = await apps.count()
    return number_of_apps
}