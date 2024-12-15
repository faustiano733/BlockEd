import db from "./helpers/connection.js"

const usuario = db.sequelize.define("usuario",{
    user_name:{
        type:db.Sequelize.STRING
    },
    conta_id:{
        type:db.Sequelize.INTEGER
    }
},{
    timeStamps:false
})

export default usuario
