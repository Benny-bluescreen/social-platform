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

    it('createUser ska kasta ett fel om användarnamn eller lösenord saknas', async () => {
        await expect(manager.createUser('', '123456')).rejects.toThrow('Användarnamn och lösenord måste anges');
        await expect(manager.createUser('newuser', '')).rejects.toThrow('Användarnamn och lösenord måste anges');
    });

    it('createUser ska kasta ett fel om användarnamnet redan existerar', async () => {
        const mockUser = { username: 'newuser', password: '123456' };
        mockUserDatabase.getUser.mockResolvedValue(mockUser);

        await expect(manager.createUser('newuser', '123456')).rejects.toThrow('Användarnamnet är redan taget');
    });

    it('createUser ska kasta ett fel om lösenordet är för kort', async () => {
        await expect(manager.createUser('newuser', '123')).rejects.toThrow('Lösenordet måste vara minst 6 tecken långt');
    });

    it('login ska autentisiera användaren', async () => {
        const mockUser = { username: 'newuser', password: '123456' };
        mockUserDatabase.getUserByCredentials.mockResolvedValue(mockUser.username);

        const user = await manager.login('newuser', '123456');
        expect(user).toEqual(mockUser.username);
        expect(mockUserDatabase.getUserByCredentials).toHaveBeenCalledWith('newuser', '123456');
    });

    it('login ska kasta ett fel om användarnamn eller lösenord saknas', async () => {
        await expect(manager.login('', '123456')).rejects.toThrow('Användarnamn och lösenord måste anges');
        await expect(manager.login('newuser', '')).rejects.toThrow('Användarnamn och lösenord måste anges');
    });

    it('login ska returnera null om användaren inte hittas', async () => {
        mockUserDatabase.getUserByCredentials.mockResolvedValue(null);

        const user = await manager.login('newuser', '123456');
        expect(user).toBeNull();
    });

    it('changePassword ska ändra lösenordet för en användare', async () => {
        const mockUser = { username: 'newuser', password: '123456', save: jest.fn() };
        mockUserDatabase.getUser.mockResolvedValue(mockUser);

        await manager.changePassword('newuser', 'newpassword');
        expect(mockUserDatabase.getUser).toHaveBeenCalledWith('newuser');
        expect(mockUser.password).toBe('newpassword');
        expect(mockUser.save).toHaveBeenCalled();
    });

    it('changePassword ska kasta ett fel om lösenordet är för kort', async () => {
        await expect(manager.changePassword('newuser', '123')).rejects.toThrow('Lösenordet måste vara minst 6 tecken långt');
    });

    it('changePassword ska kasta ett fel om användaren inte hittas', async () => {
        mockUserDatabase.getUser.mockResolvedValue(null);

        await expect(manager.changePassword('newuser', 'newpassword')).rejects.toThrow('Användare hittades inte');
    });
});