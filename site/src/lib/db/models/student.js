import db from "./helpers/connection.js";
import {school} from "./school.js";

export const students = db.sequelize.define("student",{
    idStudent:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    name:{
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID,
        references:{
            model:school, 
            key:'idSchool'},
    }
},{
    timestamps:true,
    updatedAt:false
})