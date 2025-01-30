import {students} from "./student.js";
import {school} from "./school.js";
import db from "./helpers/connection.js";
import { tipos } from "./tipoBloqueio.js";

export const blocks = db.sequelize.define('block',{
    idBlocks:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    idStudent:{
        type:db.Sequelize.INTEGER,
        references:students.idStudent
    },
    idSchool:{
        type:db.Sequelize.UUID,
        references:school.idSchool
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})