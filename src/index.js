const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/user');
const UserManager = require('./services/userManager');
const path = require('path');

const app = express();
const port = 8080;

app.use(bodyParser.json());

// Konfigurera Express att servera statiska filer från /public-mappen
// app.use(express.static(path.join(__dirname, '../public')));

// Initiera databasen
sequelize.sync().then(() => {
    console.log('Databas synkroniserad');
});

const userManager = new UserManager();

// Enkel sessionshantering i servern
const sessions = {}; // { sessionId: username }

// Middleware för att skydda dashboard-sidan
function requireLogin(req, res, next) {
    const sessionId = req.headers['x-session-id'];
    console.log('Kontrollerar sessionId:', sessionId);

    if (sessions[sessionId]) {
        req.user = sessions[sessionId]; // Koppla användaren till request-objektet
        console.log(`Giltigt sessionId för användare: ${req.user}`);
        return next(); // Tillåt åtkomst
    }

    console.log('Otillåten access: Ogiltigt sessionId');
    res.status(403).send('Otillåten access'); // Skicka ett 403-svar om sessionId är ogiltigt
}

// Registrerings-endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await userManager.createUser(username, password);
        res.status(201).send('Användare registrerad');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Inloggnings-endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await userManager.login(username, password);
    if (user) {
        const sessionId = Math.random().toString(36).substring(2, 15); // Generera unikt sessionId
        sessions[sessionId] = username; // Koppla sessionId till användare
        res.status(200).json({ sessionId, username: user }); // Skicka tillbaka sessionId till klienten
    } else {
        res.status(401).send('Felaktigt användarnamn eller lösenord');
    }
});

// Utloggnings-endpoint
app.post('/logout', (req, res) => {
    console.log('Backend');
    const sessionId = req.headers['x-session-id']; // Klienten måste skicka sessionId
    if (sessions[sessionId]) {
        delete sessions[sessionId]; // Ta bort sessionen
        res.status(200).send('Utloggad');
    } else {
        res.status(400).send('Ogiltig session');
    }
});

// Endpoint för att ändra lösenord
app.post('/change-password', requireLogin, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const username = req.user;

    try {
        const user = await userManager.login(username, oldPassword);
        if (!user) {
            return res.status(401).send('Felaktigt gammalt lösenord');
        }

        await userManager.changePassword(username, newPassword);
        res.status(200).send('Lösenord ändrat');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Skyddad dashboard
app.get('/dashboard', requireLogin, (req, res) => {
    console.log(`Serverar dashboard för användare: ${req.user}`);
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/js/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/js', 'main.js'));
});

app.get('/js/dashboard.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/js', 'dashboard.js'));
});

// Starta servern
app.listen(port, () => {
    console.log(`Server körs på http://localhost:${port}`);
});
