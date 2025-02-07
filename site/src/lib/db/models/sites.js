import {school} from "./school.js";
import db from "./helpers/connection.js";

export const sites = db.sequelize.define("site",{
    idSite:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    domine:{
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
});