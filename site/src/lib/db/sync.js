// sync.js
import db from './connection.js'; // importa o objeto com o sequelize
import './models.js'; // importa os models para que sejam registados na instância

async function syncDatabase() {
  try {
    await db.sequelize.sync({ alter: true }); // ou { force: true } para recriar tudo
    console.log('Tabelas sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar tabelas:', error);
  } finally {
    await db.sequelize.close();
  }
}

syncDatabase();
