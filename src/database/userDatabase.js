const User = require('../models/user'); // Kontrollera om detta fungerar

class UserDatabase {
    async saveUser(user) {
        try {
            return await User.create(user);
        } catch (error) {
            throw new Error('Misslyckades att spara användare i databasen');
        }
    }

    async getUser(username) {
        try {
            return await User.findOne({ where: { username } });
        } catch (error) {
            throw new Error('Misslyckades att hämta användare från databasen');
        }
    }

    async getUserByCredentials(username, password) {
        try {
            const user = await User.findOne({ where: { username, password } });
            if (!user) {
                console.log(`Ingen användare funnen med användarnamn: ${username}`);
                return null;
            }

            return user.username;

        } catch (error) {
            throw new Error('Fel vid hämtning av användare');
        }
    }
}

module.exports = UserDatabase;
