import db from "./helpers/connection.js";

export const location = db.sequelize.define("localizacao",{
    idLocation:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    longitude:{
        type:db.Sequelize.DECIMAL(5,3)
    },
    latitude:{
        type:db.Sequelize.DECIMAL(5,3)
    }
},{
    timestamps:false
})