const db = require('../config/database');


const insertUserStmt = db.prepare(`
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
`);
exports.addUser = ({ username, email, password }) => {
    if (!username || !email || !password) {
        throw new Error('Username, email and password are required');
    };

    try {
        const info = insertUserStmt.run(username, email.toLowerCase(), password);
        return { id: info, success: true };
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') 
        { throw new Error('Username or Email already exists'); };
        throw new Error(err.message);
    };
};


const getUserByEmailStmt = db.prepare(` SELECT * FROM users WHERE email = ? `);
exports.getUserByEmail = (email) => {
    if (!email) { throw new Error('Email is required'); };
    try { return getUserByEmailStmt.get(email); }
    catch (err) { throw new Error(err.message); };
};


const getUserByIdStmt = db.prepare(` SELECT * FROM users WHERE id = ? `);
exports.getUserById = (id) => {
    if (!id) { throw new Error('Id is required'); };
    try { return getUserByIdStmt.get(id); }
    catch (err) { throw new Error(err.message); };
};


const getUserByUsernameStmt = db.prepare(` SELECT * FROM users WHERE username = ? `);
exports.getUserByUsername = (username) => {
    if (!username) { throw new Error('Username is required'); };
    try { return getUserByUsernameStmt.get(username); }
    catch (err) { throw new Error(err.message); };
};



const getAllUsersStmt = db.prepare(` SELECT * FROM users `);
exports.getAllUsers = () => {
    try { return getAllUsersStmt.all(); }
    catch (err) { throw new Error(err.message); };
};

const users = this.getAllUsers();
console.log(`Users:`, users);