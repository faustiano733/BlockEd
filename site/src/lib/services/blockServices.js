import { blocks } from "../db/models//block.js"
import { block_app } from "../db/models/blockApp.js"
import { Op } from "sequelize"
import db from "../db/models//helpers/connection.js"
import { getAllApps } from "./appServices.js"
import moment from "moment"

export async function getBlocksWeek(){

    let blocks_of_week = []
    const date_now = new Date()
    const day_x = new Date()
    
    for(let i = 6;i>=0;i--){

        day_x.setDate(date_now.getDate() - i)
        let formated_date = moment(day_x).format('YYYY-MM-DD')
        
        const blocks_of_day = await blocks.findAll({
            attributes:[
                [db.sequelize.fn("Date",db.sequelize.col("createdAt")),"Date"],
                [db.sequelize.fn("COUNT", db.sequelize.col("id")), "blocks"]

            ],
            where:db.sequelize.where(db.sequelize.fn("Date", db.sequelize.col("createdAt")),"=",formated_date),
            group:[db.sequelize.fn("Date", db.sequelize.col("createdAt"))]

        })
        if(blocks_of_day.length != 0){
            blocks_of_week = [...blocks_of_week,...blocks_of_day]
        }else{
            const empty_day = {'Date':formated_date,'blocks':0};
            blocks_of_week = [...blocks_of_week, empty_day]
        }
    }


    return blocks_of_week
}

export async function getBlockedApps(){
    let blocked_apps = [];
    const all_apps = await getAllApps();
    const id_apps = lista_apps.map(app=>app.idApp);

    const all_blocks = await block_app.findAll({
        attributes:[
            "idApp",
            [db.sequelize.fn("COUNT",db.sequelize.col("idBlock")),"blocks"]
        ],
        where:{
            idApp:id_apps
        },
        group:["idApp"],
    })
     all_blocks.forEach(blocked_app=>{
        all_apps.forEach(app=>{
            if(blocked_app.id_app === app.id){
                blocked_apps = [...blocked_apps,
                    {
                      name:app.name,
                      blocks:blocked_app.tentativas
                    }
                ]
            }
        })
     })
    
    return all_blocks
}
