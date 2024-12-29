const { Sequelize } = require('sequelize');

// Använd en fil för SQLite-databasen
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Fil där datan sparas
    logging: false, // Inaktivera loggning
});

// Testa anslutningen
sequelize.authenticate()
    .then(() => console.log('Database connected.'))
    .catch((err) => console.error('Error connecting to the database:', err));

module.exports = sequelize;
