import db from "./helpers/connection.js";

const apps = db.sequelize.define("app",{
    nome:{
        type:db.Sequelize.STRING
    },
    ativado:{
        type:db.Sequelize.BOOLEAN
    },
    package_name:{
        type:db.Sequelize.STRING
    },
    escola_id:{
        type:db.Sequelize.INTEGER
    }
})

export default apps