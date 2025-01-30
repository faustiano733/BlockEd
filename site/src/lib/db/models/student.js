import db from "./helpers/connection.js";
import {school} from "./school.js";

export const students = db.sequelize.define("student",{
    idStudent:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    name:{
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID,
        references: school.idSchool,
        foreignKey:true
    }
},{
    timestamps:true,
    updatedAt:false
})