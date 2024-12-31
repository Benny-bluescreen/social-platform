const { Sequelize } = require('sequelize');

// Använd en fil för SQLite-databasen
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Fil där datan sparas
    logging: false, // Inaktivera loggning
});

// Testa anslutningen och synkronisera modellerna
sequelize.authenticate()
    .then(() => {
        console.log('Databas ansluten.');
        return sequelize.sync(); // Synkronisera modellerna
    })
    .then(() => {
        console.log('Modelldb synkroniserad.');
    })
    .catch((err) => {
        console.error('Fel vid anslutning till db:', err);
    });

module.exports = sequelize;
