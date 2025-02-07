import {students} from "./student.js";
import {apps} from "./apps.js";
import db from "./helpers/connection.js";
import { blocks } from "./block.js";

export const block_app = db.sequelize.define('blockApp',{
    idBlockApp:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    idStudent:{
        type:db.Sequelize.UUID,
        references:{
            model:students,
            key:'idStudent'
        }
    },
    idApp:{
        type:db.Sequelize.UUID,
        references:{
            model:apps,
            key:'idApp'
        }
    },
    idBlock:{
        type:db.Sequelize.UUID,
        references:{
            model:blocks,
            key:'idBlock'
        }
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})