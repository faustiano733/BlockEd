import { tentativas_app } from "../db/models/tentativas_app.js";
import db from "../db/models/helpers/connection.js";
import { Op } from "sequelize";


export async function pegaTotalTentivasSemana(){
    
    const data_actual = new Date()
    const sete_dias_antes = new Date()
    sete_dias_antes.setDate(data_actual.getDate() - 7)
    
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


async function tentativasAluno(id_aluno){
    const tentativas_aluno = await tentativas_app.findAll({
        attributes:{
            include:[[db.sequelize.fn("COUNT", db.sequelize.col('id')), "tentou"]]
        }
    })

    return tentativas_aluno
}

async function countTeste(app_id){
    const app = await tentativas_app.count({
        where:{
            id_app:app_id
        }
    })
    return app
}


async function tentivasSemana(){
    const data_actual = new Date()
    const sete_dias_antes = new Date()
    sete_dias_antes.setDate(data_actual.getDate() - 7)
    console.log(data_actual)
    console.log(sete_dias_antes)
}
