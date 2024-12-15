import db from "./helpers/connection.js";

const dispositivo = db.sequelize.define("dispositivo",{
    aluno_id:{
        type:db.Sequelize.INTEGER
    },
    mac_adrress:{
        type:db.Sequelize.STRING
    },
    ultima_conexao:{
        type:db.Sequelize.STRING
    }
})

export default dispositivo;