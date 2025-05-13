import db from "./connection.js";

export const account = db.sequelize.define("account",{
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    email:{
        type:db.Sequelize.STRING
    },
    password:{
        type:db.Sequelize.STRING
    }
},{
    timestamps:true,
    updatedAt:false
});

export const apps = db.sequelize.define("app",{
    id:{
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
    }
},{
    timestamps:true,
    updatedAt:false
})

export const blocks = db.sequelize.define('block',{
    idBlock:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    idStudent:{
        type:db.Sequelize.UUID
    },
    idSchool:{
        type:db.Sequelize.UUID
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})

export const device = db.sequelize.define("device",{
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    model:{
        type:db.Sequelize.STRING
    },
    idStudent:{
        type:db.Sequelize.UUID
    },
    UID:{
        type:db.Sequelize.STRING
    },
    updatedAt: {
        type:db.Sequelize.DATE,
        defaultValue: new Date()
    }
},{
    timestamps:true,
    updatedAt:false
})

export const location = db.sequelize.define("localization",{
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    longitude:{
        type:db.Sequelize.STRING
    },
    latitude:{
        type:db.Sequelize.STRING
    },
    radius:{
        type:db.Sequelize.INTEGER
    },
    idSchool:{
        type:db.Sequelize.UUID
    }
},{
    timestamps:false
})

export const school = db.sequelize.define("school",{
    id:{
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
        type:db.Sequelize.UUID
    }
},{
    timestamps:true,
    createdAt:true,
    updatedAt:false
})

export const exception = db.sequelize.define('exceptions',{
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    date:{
        type:db.Sequelize.DATE,
        allowNull:false
    },
    idSchool:{
        type:db.Sequelize.UUID
    }
},{
    timestamps:false
})

export const sites = db.sequelize.define("site",{
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    domain:{
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID
    }

},{
    timestamps:true,
    updatedAt:false
});

export const subSite = db.sequelize.define("sub_site", {
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    domain:{
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID
    }

},{
    timestamps:true,
    updatedAt:false
})

export const students = db.sequelize.define("student",{
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    name:{
        type:db.Sequelize.STRING
    },
    birthday: {
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID
    }
},{
    timestamps:true,
    updatedAt:false
})

export const user = db.sequelize.define("user",{
    id:{
        type:db.Sequelize.UUID,
        primaryKey:true,
        defaultValue:db.Sequelize.UUIDV4
    },
    name:{
        type:db.Sequelize.STRING
    },
    idAccount:{
        type:db.Sequelize.UUID
     }
},{
    timeStamps:false
})

export const schoolCode = db.sequelize.define('school_code',{
    id:{

        type:db.Sequelize.UUID,
        defaultValue:db.Sequelize.UUIDV4,
        primaryKey:true

    },
    code:{
        type:db.Sequelize.STRING(8),
        unique:true,
        allowNull:false
    },
    idSchool:{
        type:db.Sequelize.UUID,
        allowNull:false
    },
    expiresAt:{
        type:db.Sequelize.DATE
    },
    isUsed:{
        type:db.Sequelize.BOOLEAN,
        defaultValue:false
    }
})

export const alert = db.sequelize.define('alert',{
    id:{

        type:db.Sequelize.UUID,
        defaultValue:db.Sequelize.UUIDV4,
        primaryKey:true

    },
    text:{
        type:db.Sequelize.STRING
    },
    idSchool:{
        type:db.Sequelize.UUID,
        allowNull:false
    },
    read: {
        type:db.Sequelize.BOOLEAN,
        defaultValue:false
    }
})

export const attempt = db.sequelize.define('attempt',{
    id:{

        type:db.Sequelize.UUID,
        defaultValue:db.Sequelize.UUIDV4,
        primaryKey:true

    },
    type:{
        type:db.Sequelize.STRING
    },
    value:{
        type:db.Sequelize.STRING
    },
    createdAt:{
        type:db.Sequelize.DATE
    },

})

