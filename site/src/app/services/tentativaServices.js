import { tentativas_app } from "../db/models/tentativas_app.js"
import { Op } from "sequelize"
import db from "../db/models/helpers/connection.js"
import { pegarTodosApps } from "./appServices.js"


export async function pegaTotalTentivasSemana(){
    
    const data_actual = new Date()
    const sete_dias_antes = new Date()
    
    sete_dias_antes.setDate(data_actual.getDate() - 20)
    const tentativas_semana = await tentativas_app.findAll({
        attributes:[
            [db.sequelize.fn("Date",db.sequelize.col("teste_tentativas_data")),"Data"],
            [db.sequelize.fn("COUNT", db.sequelize.col("id")), "tentivas"]

        ],
        where:{
            "teste_tentativas_data":{[Op.gte]:sete_dias_antes}
        },
        group:[db.sequelize.fn("Date", db.sequelize.col("teste_tentativas_data"))]

    })

    return tentativas_semana
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

