import db from "./helpers/connection.js";

export const tentativas_app = db.sequelize.define("tentativas_app",{
    id_app:{
        type:db.Sequelize.INTEGER
    },
    id_aluno:{
        type:db.Sequelize.INTEGER
    },
    id_escola:{
        type:db.Sequelize.INTEGER
    },
    teste_tentativas_data:{
        type:db.Sequelize.DATE
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})