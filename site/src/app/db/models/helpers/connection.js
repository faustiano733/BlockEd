import "dotenv/config"

import { Sequelize } from "sequelize";
import module from "mysql2"

const sequelize = new Sequelize("blocked" ,"root", "",{
    dialect:"mysql",
    host:"localhost",
    dialectModule:module
});

const db = {
    sequelize:sequelize,
    Sequelize:Sequelize
};



export default db;