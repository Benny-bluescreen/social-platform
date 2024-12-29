const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('../db'); // Importera sequelize-instansen från db.js
const User = require('./models/user'); // Importera User-modellen
const UserManager = require('./services/userManager');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(express.static('public'));

const userManager = new UserManager();

// Initiera och synkronisera databasen
sequelize.sync({ force: false }) // Ändra till `force: true` vid behov för att rensa tabeller (endast utveckling).
    .then(() => {
        console.log('Database synced');
        // Starta servern efter att databasen är redo
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

// Registrerings-endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await userManager.createUser(username, password);
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Inloggnings-endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userManager.login(username, password);
        if (user) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('An error occurred');
    }
});
