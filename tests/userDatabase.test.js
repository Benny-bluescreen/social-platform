const { sequelize, User } = require('../src/models/user');
const UserDatabase = require('../src/database/userDatabase');

beforeAll(async () => {
    await sequelize.sync();
});

test('saveUser ska spara en användare', async () => {
    const db = new UserDatabase();
    const user = await db.saveUser({ username: 'testuser', password: '1234' });
    expect(user.username).toBe('testuser');
});

test('getUser ska hämta en användare', async () => {
    const db = new UserDatabase();
    const user = await db.getUser('testuser');
    expect(user).not.toBeNull();
    expect(user.username).toBe('testuser');
});
