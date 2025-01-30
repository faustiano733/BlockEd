import { account } from "./account.js"
import db from "./helpers/connection.js"

export const user = db.sequelize.define("user",{
    idUser:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    name:{
        type:db.Sequelize.STRING
    },
    idAccount:{
        type:db.Sequelize.UUID,
        references:account.idaccount,
        foreignKey:true
    }
},{
    timeStamps:false
})