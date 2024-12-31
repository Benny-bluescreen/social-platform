const UserDatabase = require('../database/userDatabase');

class UserManager {
    constructor() {
        this.userDatabase = new UserDatabase();
    }

    async createUser(username, password) {
        // Kontrollera om användarnamn eller lösenord är tomt
        if (!username || !password) {
            throw new Error('Användarnamn och lösenord måste anges');
        }

        // Kontrollera om användarnamnet redan existerar
        const existingUser = await this.userDatabase.getUser(username);
        if (existingUser) {
            throw new Error('Användarnamnet är redan taget');
        }

        // Validera lösenordets längd (exempelregel)
        if (password.length < 6) {
            throw new Error('Lösenordet måste vara minst 6 tecken långt');
        }

        // Skapa och spara användaren
        return await this.userDatabase.saveUser({ username, password });
    }

    async login(username, password) {
        // Kontrollera om användarnamn och lösenord är angivet
        if (!username || !password) {
            throw new Error('Användarnamn och lösenord måste anges');
        }

        // Hämta användaren med matchande användarnamn och lösenord
        const user = await this.userDatabase.getUserByCredentials(username, password);
        if (!user) {
            return null; // Returnera null om ingen användare hittades
        }

        // Returnera användarnamnet om inloggning lyckas
        return user;
    }

    async changePassword(username, newPassword) {
        // Validera lösenordets längd (exempelregel)
        if (newPassword.length < 6) {
            throw new Error('Lösenordet måste vara minst 6 tecken långt');
        }

        const user = await this.userDatabase.getUser(username);
        if (!user) {
            throw new Error('Användare hittades inte');
        }

        user.password = newPassword;
        await user.save();
    }
}

module.exports = UserManager;
