import { apps } from "../db/models.js";
import gplay from "google-play-scraper"

export async function getAllApps(idSchool){
    const all_apps_list = await apps.findAll({where:{idSchool:idSchool}})
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
    console.log(suggest_apps_list)
    return suggest_apps_list;
}

export async function addApp(name, packageName,idSchool){
    const added_app = await apps.create({name, packageName, active:true,idSchool})
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

export async function deleteApp({id,idSchool,name}){
    await apps.destroy({where:{id,idSchool,name}})
}

export async function getNumberOfApps(idSchool){
    const number_of_apps = await apps.count({
        where:{
            idSchool
        }
    })
    return number_of_apps
}