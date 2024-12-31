const UserManager = require('../src/services/userManager');
const UserDatabase = require('../src/database/userDatabase');

jest.mock('../db', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock;
});

jest.mock('../src/models/user', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock.define('User', {
        username: 'testuser',
        password: '123456'
    });
});

jest.mock('../src/database/userDatabase'); // Mocka UserDatabase-klassen

describe('UserManager', () => {
    let manager;
    let mockUserDatabase;

    beforeEach(() => {
        mockUserDatabase = new UserDatabase();
        manager = new UserManager();
        manager.userDatabase = mockUserDatabase;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('createUser ska skapa en ny användare', async () => {
        const mockUser = { username: 'newuser', password: '123456' };
        mockUserDatabase.getUser.mockResolvedValue(null);
        mockUserDatabase.saveUser.mockResolvedValue(mockUser);

        const user = await manager.createUser('newuser', '123456');
        expect(user).toEqual(mockUser);
        expect(mockUserDatabase.getUser).toHaveBeenCalledWith('newuser');
        expect(mockUserDatabase.saveUser).toHaveBeenCalledWith(mockUser);
    });

    it('login ska autentisiera användaren', async () => {
        const mockUser = { username: 'newuser', password: '123456' };
        mockUserDatabase.getUserByCredentials.mockResolvedValue(mockUser.username);

        const user = await manager.login('newuser', '123456');
        expect(user).toEqual(mockUser.username);
        expect(mockUserDatabase.getUserByCredentials).toHaveBeenCalledWith('newuser', '123456');
    });

    it('changePassword ska ändra lösenordet för en användare', async () => {
        const mockUser = { username: 'newuser', password: '123456', save: jest.fn() };
        mockUserDatabase.getUser.mockResolvedValue(mockUser);

        await manager.changePassword('newuser', 'newpassword');
        expect(mockUserDatabase.getUser).toHaveBeenCalledWith('newuser');
        expect(mockUser.password).toBe('newpassword');
        expect(mockUser.save).toHaveBeenCalled();
    });
});