import db from "./helpers/connection.js";

const localizacao = db.sequelize.define("localizacao",{
    longitude:{
        type:db.Sequelize.DECIMAL(5,3)
    },
    latitude:{
        type:db.Sequelize.DECIMAL(5,3)
    }
})

export default localizacao