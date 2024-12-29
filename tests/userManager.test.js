const UserManager = require('../src/services/userManager');
const { sequelize } = require('../src/models/user');

beforeAll(async () => {
    await sequelize.sync();
});

test('createUser ska skapa en ny användare', async () => {
    const manager = new UserManager();
    const user = await manager.createUser('newuser', '12345');
    expect(user.username).toBe('newuser');
});

test('login ska authentisiera användaren', async () => {
    const manager = new UserManager();
    const user = await manager.login('newuser', '12345');
    expect(user).not.toBeNull();
});
