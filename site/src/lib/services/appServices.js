import { apps, attempt } from "../db/models.js";
import gplay from "google-play-scraper";
import db from "../db/connection";
import {getNumberOfAttempts} from "@/lib/services/attemptServices";

export async function getAllApps(idSchool){
    let all_apps_list = await apps.findAll({where:{idSchool:idSchool}})
    let all_apps = []
    for(let i = 0; i < all_apps_list.length; i ++){
        let el = all_apps_list[i]
        let at = await attempt.count({
            where: {
                idSchool,
                value: el.packageName
            }
        })
        //console.log(at)
        all_apps = [...all_apps, {
            id: el.id, 
            name: el.name, 
            active: el.active, 
            packageName: el.packageName, 
            idSchool: el.idSchool, 
            createdAt: el.createdAt, 
            attempts: at
        }]
        //console.log(all_apps_list[index])
    }

    console.log(all_apps)

    return all_apps
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

export async function getTop4Apps(idSchool){
    const apps = await db.sequelize.query(`
    SELECT 
        a.*, 
        (
        SELECT COUNT(*) 
        FROM attempts at 
        WHERE at.value = a."packageName" and "idSchool" = ?
        ) AS "totalAttempts"
    FROM apps a WHERE "idSchool" = ?
    ORDER BY "totalAttempts" DESC
    LIMIT 4
`, {
    replacements: [idSchool, idSchool],
    type: db.sequelize.QueryTypes.SELECT
});

    return apps;
}