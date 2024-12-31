const UserDatabase = require('../src/database/userDatabase');
const User = require('../src/models/user');

jest.mock('../db', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    return dbMock;
});

jest.mock('../src/models/user')

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

    it('getUser ska hämta en användare', async () => {
        const mockUser = { username: 'testuser', password: '123456' };
        User.findOne.mockResolvedValue(mockUser);

        const user = await db.getUser('testuser');
        expect(user).toEqual(mockUser);
        expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('getUserByCredentials ska hämta en användare med rätt användarnamn och lösenord', async () => {
        const mockUser = { username: 'testuser', password: '123456' };
        User.findOne.mockResolvedValue(mockUser);

        const user = await db.getUserByCredentials('testuser', '123456');
        expect(user).toEqual(mockUser.username);
        expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser', password: '123456' } });
    });
});