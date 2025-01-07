import "dotenv/config"

import { Sequelize } from "sequelize";
import module from "mysql2"

const sequelize = new Sequelize(process.env.DATABASE_NAME ,process.env.DATABASE_USER, process.env.DATABSE_PASSWORD,{
    dialect:"mysql",
    host:process.env.DATABASE_HOST,
    dialectModule:module
});

const db = {
    sequelize:sequelize,
    Sequelize:Sequelize
};


export default db;