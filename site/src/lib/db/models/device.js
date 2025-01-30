import {students} from "./student.js";
import db from "./helpers/connection.js";

export const device = db.sequelize.define("device",{
    idDevice:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    idStudent:{
        type:db.Sequelize.UUID,
        references:students.idStudent,
        foreignKey:true
    },
    mac_adrress:{
        type:db.Sequelize.STRING
    },
},{
    timestamps:true,
    updatedAt:false
})