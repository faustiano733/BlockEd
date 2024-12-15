import db from "./helpers/connection.js";

const sites = db.sequelize.define("site",{
    dominio:{
        type:db.Sequelize.STRING
    },
    escola_id:{
        type:db.Sequelize.INTEGER
    }
});

export default sites;