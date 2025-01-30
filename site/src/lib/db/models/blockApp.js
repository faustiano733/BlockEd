import {students} from "./student.js";
import {apps} from "./apps.js";
import db from "./helpers/connection.js";
import { blocks } from "./block.js";

export const block_app = db.sequelize.define('blockApp',{
    idBlockApp:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    idStudent:{
        type:db.Sequelize.INTEGER,
        references:students.idStudent
    },
    idApp:{
        type:db.Sequelize.UUID,
        references:apps.idApp
    },
    idBlock:{
        type:db.Sequelize.UUID,
        references:blocks.idBlock
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})