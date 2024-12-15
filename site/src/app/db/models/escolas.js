import db from "./helpers/connection.js"

const escolas = db.sequelize.define("escola",{
    nome:{
        type:db.Sequelize.STRING
    },
    block_sites:{
        type:db.Sequelize.INTEGER(1)
    },
    block_apps:{
        type:db.Sequelize.INTEGER(1)
    },
    block_internet:{
        type:db.Sequelize.INTEGER(1) 
    },
    block_cam:{
        type:db.Sequelize.INTEGER(1)
    },
    user_id:{
        type:db.Sequelize.INTEGER
    },
    localizacao:{
        type:db.Sequelize.INTEGER
    }
},{
    timestamps:true,
    createdAt:'updateTimeStamp',
    updatedAt:false
})

export default escolas