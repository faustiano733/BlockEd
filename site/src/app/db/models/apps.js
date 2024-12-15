import db from "./helpers/connection.js";

const apps = db.sequelize.define("app",{
    nome:{
        type:db.Sequelize.STRING
    },
    package_name:{
        type:db.Sequelize.STRING
    },
    escola_id:{
        type:db.Sequelize.INTEGER
    }
})

export default apps