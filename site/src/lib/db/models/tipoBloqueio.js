import db from "./helpers/connection.js";

export const tipos = db.sequelize.define('tipoBloqueio',{
    idTipo:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    tipo:{
        type:db.Sequelize.STRING
    }
},{
    timestamps:false
})