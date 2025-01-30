import {school} from "./school.js";
import db from "./helpers/connection.js";

export const sites = db.sequelize.define("site",{
    idSite:{
        type:db.Sequelize.UUID,
        primaryKey:true
    },
    domine:{
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID,
        references:school.idSchool,
        foreignKey:true
    }

},{
    timestamps:true,
    updatedAt:false
});