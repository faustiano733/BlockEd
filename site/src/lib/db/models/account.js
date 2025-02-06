import db from "./helpers/connection.js";

export const account = db.sequelize.define("account",{
    idAccount:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    email:{
        type:db.Sequelize.STRING
    },
    password:{
        type:db.Sequelize.STRING
    }
},{
    timestamps:true,
    updatedAt:false
});