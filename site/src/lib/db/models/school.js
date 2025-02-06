import db from "./helpers/connection.js"
import { location } from "./location.js"
import { user } from "./user.js"

export const school = db.sequelize.define("school",{
    idSchool:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    name:{
        type:db.Sequelize.STRING
    },
    blockSites:{
        type:db.Sequelize.BOOLEAN
    },
    blockApps:{
        type:db.Sequelize.BOOLEAN
    },
    blockInternet:{
        type:db.Sequelize.BOOLEAN 
    },
    blockCam:{
        type:db.Sequelize.BOOLEAN
    },
    idUser:{
        type:db.Sequelize.UUID,
        references:{
            model:user,
            key:"idUser"
        },
        foreignKey:true
    },
    idLocation:{
        type:db.Sequelize.UUID,
        references:{
            model:location, 
            key:"idLocation"},
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})