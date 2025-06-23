// sync.js
import db from './connection.js'; // importa o objeto com o sequelize
import * as models from './models.js'; // importa os models para que sejam registados na instância
import dotenv from 'dotenv';
dotenv.config();

async function syncDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida.');
    await db.sequelize.sync({ alter: true }); // ou { force: true } para recriar tudo
    console.log('Tabelas sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  } finally {
    await db.sequelize.close();
  }
}

syncDatabase();