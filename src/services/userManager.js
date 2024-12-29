const User = require('../models/user'); // Kontrollera att sökvägen stämmer

class UserManager {
    async createUser(username, password) {
        // Kontrollera att User används korrekt
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            throw new Error('Username already exists');
        }
        return await User.create({ username, password });
    }

    async login(username, password) {
        const user = await User.findOne({ where: { username, password } });
        return user || null;
    }
}

module.exports = UserManager;
