const db = require('../config/database');


const addRefreshTokenStmt = db.prepare (` 
    INSERT INTO refresh_tokens (token, user_id, expires_at) 
    VALUES (?, ?, ?) 
`);
exports.addRefreshToken = (ref_token, user_id, exp_at) => {
    try { return addRefreshTokenStmt.run(ref_token, user_id, exp_at); }
    catch (err) { throw new Error(err.message); }
}


const getRefreshTokenStmt = db.prepare
(`SELECT * FROM refresh_tokens WHERE token = ?`);
exports.getRefreshToken = (token) => {
    try { return getRefreshTokenStmt.get(token); }
    catch (err) { throw new Error(err.message); }
}


const removeRefreshTokenStmt = db.prepare
(`DELETE FROM refresh_tokens WHERE token = ?`);
exports.removeRefreshToken = (token) => {
    try { return removeRefreshTokenStmt.run(token); }
    catch (err) { throw new Error(err.message); }
}


const removeAllRefreshTokensByUserIdStmt = db.prepare
(`DELETE FROM refresh_tokens WHERE user_id = ?`);
exports.removeAllRefreshTokensByUserId = (user_id) => {
    try { return removeAllRefreshTokensByUserIdStmt.run(user_id); }
    catch (err) { throw new Error(err.message); }
}