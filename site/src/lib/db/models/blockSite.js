import alunos from "./student.js";
import db from "./helpers/connection.js";
import sites from "./sites.js";

export const block_site = db.sequelize.define('blockSite',{
    idBlockSite:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    idStudent:{
        type:db.Sequelize.INTEGER,
        references:alunos.idAluno
    },
    idSite:{
        type:db.Sequelize.UUID,
        references:sites.idSite
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})