import {school} from "./school.js";
import db from "./helpers/connection.js";

export const apps = db.sequelize.define("app",{
    idApp:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    name:{
        type:db.Sequelize.STRING
    },
    active:{
        type:db.Sequelize.BOOLEAN
    },
    packageName:{
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID,
        references:{
            model:school,
            key:'idSchool'
        },
        foreignKey:true
    }
},{
    timestamps:true,
    updatedAt:false
})