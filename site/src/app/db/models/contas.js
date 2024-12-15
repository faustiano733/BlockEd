import db from "./helpers/connection.js";

const conta = db.sequelize.define("conta",{
    email:{
        type:db.Sequelize.STRING
    },
    password:{
        type:db.Sequelize.STRING
    }
});

export default conta;