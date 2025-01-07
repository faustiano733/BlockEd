import db from "./helpers/connection.js";

export const tentativas_site = db.sequelize.define("tentativas_site",{
    id_site:{
        type:db.Sequelize.INTEGER
    },
    id_aluno:{
        type:db.Sequelize.INTEGER
    },
    id_escola:{
        type:db.Sequelize.INTEGER
    }
},{
    timestamps:false,
    createdAt:'updateTimestamp',
    updatedAt:false
})