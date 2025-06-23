import { Sequelize } from 'sequelize';
import 'pg';
import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize("postgresql://postgres.soniswojepdhlchywclb:XogvwNvkGyGW4Wzr@aws-0-eu-central-2.pooler.supabase.com:5432/postgres",
  {                              //postgresql://postgres.soniswojepdhlchywclb:[YOUR-PASSWORD]@aws-0-eu-central-2.pooler.supabase.com:5432/postgres
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    //logging: false, // opcional: remove os logs SQL no console
  }
);


const db = {
    sequelize:sequelize,
    Sequelize:Sequelize
};

export default db;