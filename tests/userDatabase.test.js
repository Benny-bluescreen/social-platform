const UserDatabase = require('../src/database/userDatabase');
const User = require('../src/models/user');

jest.mock('../db', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock;
});

jest.mock('../src/models/user');

describe('UserDatabase', () => {
    let db;

    beforeEach(() => {
        db = new UserDatabase();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('saveUser ska spara en användare', async () => {
        const mockUser = { username: 'testuser', password: '123456' };
        User.create.mockResolvedValue(mockUser);

        const user = await db.saveUser(mockUser);
        expect(user).toEqual(mockUser);
        expect(User.create).toHaveBeenCalledWith(mockUser);
    });

    it('saveUser ska kasta ett fel om användaren inte kan sparas', async () => {
        const mockUser = { username: 'testuser', password: '123456' };
        User.create.mockRejectedValue(new Error('Misslyckades att spara användare i databasen'));

        await expect(db.saveUser(mockUser)).rejects.toThrow('Misslyckades att spara användare i databasen');
    });

    it('getUser ska hämta en användare', async () => {
        const mockUser = { username: 'testuser', password: '123456' };
        User.findOne.mockResolvedValue(mockUser);

        const user = await db.getUser('testuser');
        expect(user).toEqual(mockUser);
        expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('getUser ska kasta ett fel om användaren inte kan hämtas', async () => {
        User.findOne.mockRejectedValue(new Error('Misslyckades att hämta användare från databasen'));

        await expect(db.getUser('testuser')).rejects.toThrow('Misslyckades att hämta användare från databasen');
    });

    it('getUserByCredentials ska hämta en användare med rätt användarnamn och lösenord', async () => {
        const mockUser = { username: 'testuser', password: '123456' };
        User.findOne.mockResolvedValue(mockUser);

        const user = await db.getUserByCredentials('testuser', '123456');
        expect(user).toEqual(mockUser.username);
        expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser', password: '123456' } });
    });

    it('getUserByCredentials ska returnera null om användaren inte hittas', async () => {
        User.findOne.mockResolvedValue(null);

        const user = await db.getUserByCredentials('testuser', '123456');
        expect(user).toBeNull();
        expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser', password: '123456' } });
    });

    it('getUserByCredentials ska kasta ett fel om användaren inte kan hämtas', async () => {
        User.findOne.mockRejectedValue(new Error('Fel vid hämtning av användare'));

        await expect(db.getUserByCredentials('testuser', '123456')).rejects.toThrow('Fel vid hämtning av användare');
    });
});