import db from "./helpers/connection.js";

const alunos = db.sequelize.define("aluno",{
    nome:{
        type:db.Sequelize.STRING
    },
    escola_id:{
        type:db.Sequelize.INTEGER
    }
})

export default alunos