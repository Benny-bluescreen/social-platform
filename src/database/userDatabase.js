const { User } = require('../models/user');

class UserDatabase {
    async saveUser(user) {
        return await User.create(user);
    }

    async getUser(username) {
        return await User.findOne({ where: { username } });
    }
}

module.exports = UserDatabase;