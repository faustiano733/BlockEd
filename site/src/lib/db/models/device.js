import {students} from "./student.js";
import db from "./helpers/connection.js";

export const device = db.sequelize.define("device",{
    idDevice:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    idStudent:{
        type:db.Sequelize.UUID,
        references:{
            model:students,
            key:'idStudent'}
    },
    mac_adrress:{
        type:db.Sequelize.STRING
    },
},{
    timestamps:true,
    updatedAt:false
})