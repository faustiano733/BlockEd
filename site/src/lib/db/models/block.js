import {students} from "./student.js";
import {school} from "./school.js";
import db from "./helpers/connection.js";

export const blocks = db.sequelize.define('block',{
    idBlocks:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    idStudent:{
        type:db.Sequelize.INTEGER,
        references:{
            model:students,
            key:'idStudent'}
    },
    idSchool:{
        type:db.Sequelize.UUID,
        references:{
            model:school,
            key:'idSchool'}
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})