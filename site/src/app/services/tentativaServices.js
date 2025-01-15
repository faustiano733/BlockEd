import { tentativas_app } from "../db/models/tentativas_app.js"
import { Op } from "sequelize"
import db from "../db/models/helpers/connection.js"
import { pegarTodosApps } from "./appServices.js"
import moment from "moment"

export async function getBlocksWeek(){

    let blocks_of_week = []
    const date_now = new Date()
    const day_x = new Date()
    
    for(let i = 6;i>=0;i--){

        day_x.setDate(date_now.getDate() - i)
        let formated_date = moment(day_x).format('YYYY-MM-DD')
        
        const blocks_of_day = await tentativas_app.findAll({
            attributes:[
                [db.sequelize.fn("Date",db.sequelize.col("teste_tentativas_data")),"Data"],
                [db.sequelize.fn("COUNT", db.sequelize.col("id")), "tentivas"]

            ],
            where:db.sequelize.where(db.sequelize.fn("Date", db.sequelize.col("teste_tentativas_data")),"=",formated_date),
            group:[db.sequelize.fn("Date", db.sequelize.col("teste_tentativas_data"))]

        })
        if(blocks_of_day.length != 0){
            blocks_of_week = [...blocks_of_week,...blocks_of_day,formated_date]
        }else{
            const empty_day = {'Data':formated_date,'tentativas':0};
            blocks_of_week = [...blocks_of_week, empty_day]
        }
    }


    return blocks_of_week
}

export async function pegaAppsTentados(){
    let lista_apps_tentados = [];
    const lista_apps = await pegarTodosApps();
    const lista_id_apps = lista_apps.map(app=>app.id);

    const apps_tentados = await tentativas_app.findAll({
        attributes:[
            "id_app",
            [db.sequelize.fn("COUNT",db.sequelize.col("id")),"tentativas"]
        ],
        where:{
            id_app:lista_id_apps
        },
        group:["id_app"],
    })
     apps_tentados.forEach(app_tentado=>{
        //const teste = JSON.stringify(app_tentado)
        //console.log(teste.tentativas)
        lista_apps.forEach(app=>{
            if(app_tentado.id_app === app.id){
                lista_apps_tentados = [...lista_apps_tentados,
                    {
                      nome:app.nome,
                      tentativas:app_tentado.tentativas
                    }
                ]
            }
        })
     })
    
    return lista_apps_tentados
}
