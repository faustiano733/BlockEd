import {students} from "./student.js";
import db from "./helpers/connection.js";
import {sites} from "./sites.js";
import { blocks } from "./block.js";

export const block_site = db.sequelize.define('blockSite',{
    idBlockSite:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },idStudent:{
        type:db.Sequelize.UUID,
        references:{
            model:students,
            key:'idStudent'}
    },
    idSite:{
        type:db.Sequelize.UUID,
        references:{
            model:sites,
            key:'idSite'}
    },
    idBlock:{
        type:db.Sequelize.UUID,
        references:{
            model:blocks,
            key:'idBlock'}
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})