require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { 
    getRefreshToken, addRefreshToken, removeRefreshToken 
} = require('../models/token.model');
const { addUser, getUserByEmail, getUserByUsername, getUserById } = require('../models/user.model');

exports.generateToken = (payload) => {
    try { return jwt.sign(payload, process.env.ACCESS_TOKEN); }
    catch (err) { throw new Error(err.message); };
}


exports.generateRefreshToken = (payload) => {
    try { return jwt.sign( payload, process.env.REFRESH_TOKEN); }
    catch (err) { throw new Error(err.message); };
}


exports.verifyToken = (token) => {
    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN);
        if (!user) return false;

        const userRecord = getUserById(user.sub);
        if (userRecord.ver !== user.ver) return false;
        
        return user;
    }
    catch (err) {
        throw new Error(err.message);        
    }
}


exports.verifyRefreshToken = (token) => {
    try {
        const refToken = jwt.verify(token, process.env.REFRESH_TOKEN);
        if (!refToken) return false;

        const tokenRecord = getRefreshToken(token);
        if (!tokenRecord || !tokenRecord.is_valid || tokenRecord.expires_at < Date.now()) 
        { console.log ('token not found'); return false; };

        const userRecord = getUserById(refToken.sub);
        if (userRecord.ver !== refToken.ver) 
        { console.log ('user not found'); return false; };
        
        return refToken;
    }
    catch (err) {
        throw new Error(err.message);
    }
}


exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password ) 
        { res.status(400).send('Username, email and password are required'); return; };

        if (getUserByEmail(email)) 
        { res.status(400).send('Email already exists'); return; };
        
        if (getUserByUsername(username)) 
        { res.status(400).send('Username already exists'); return; };
    
        const hash = await bcrypt.hash(password, 10);

        const info = addUser({ 
            username, 
            email, 
            password: hash 
        });

        console.log('Signup successful:', info, '\n');
        res.status(201).send({ success: true });
    }
    catch (err) {
        console.log('Signup failed:', err);
        res.status(500).send('Internal Server Error');
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) 
        { res.status(400).send('Email and password are required'); return; };

        const user = getUserByEmail(email);

        if (!user) { res.status(401).send('Invalid email'); return; };

        if (!await bcrypt.compare(password, user.password)) 
        { res.status(401).send('Invalid password'); return; };

        const accessToken = this.generateToken({
            sub: user.id,
            username: user.username,
            ver: user.ver
        });
        const refreshToken = this.generateRefreshToken({ 
            sub: user.id,
            ver: user.ver
        });

        res.cookie('token', accessToken, { 
            httpOnly: true, 
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000
            // maxAge: 3000
        });

        const maxAge = 7 * 24 * 60 * 60 * 1000;
        const expDate = Date.now() + maxAge;
        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/auth/refresh'
        });

        addRefreshToken(refreshToken, user.id, expDate);
        
        console.log('Login successful:', user);
        console.log('Access token:', accessToken);
        console.log('Refresh token:', refreshToken, '\n');
        res.status(200).send({ success: true });
    }
    catch (err) {
        console.log('Login failed:', err);
        res.status(500).send('Internal Server Error');
    }
}


exports.refresh = (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) { return res.status(400).send('Missing refresh token'); };

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        if (!decoded) { return res.status(401).send('Invalid refresh token'); };

        const tokenRecord = getRefreshToken(refreshToken);
        if (!tokenRecord || !tokenRecord.is_valid || tokenRecord.expires_at < Date.now()) 
        { return res.status(401).send('Invalid refresh token'); };

        const user = getUserById(decoded.sub);
        if (!user) { return res.status(404).send('User does not exists'); };
    
        const newToken = this.generateToken({
            sub: user.id,
            username: user.username,
            ver: user.ver
        });

        res.cookie('token', newToken, { 
            httpOnly: true, 
            secure: false,
            sameSite: 'lax',
            maxAge: 3000
        });

        console.log('Refresh token successful:', user);
        console.log('New access token:', newToken);
        console.log('Refresh token:', refreshToken, '\n');
        res.status(200).send({ success: true });
    }
    catch (err) {
        console.log('Refresh token failed:', err);
        res.status(500).send('Internal Server Error');
    }
}


exports.logout = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) { res.status(400).send('Missing token'); return; };

        const user = this.verifyToken(token);
        if (!user) { res.status(401).send('Invalid token'); return; };

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) { res.status(400).send('Missing refresh token'); return; };

        const ver_refToken = this.verifyRefreshToken(refreshToken);
        if (!ver_refToken) { res.status(401).send('Invalid refresh token'); return; };

        removeRefreshToken(refreshToken);

        res.clearCookie('token');
        res.clearCookie('refreshToken');
        
        console.log('Logout successful:', user, '\n');
        res.status(200).send({ success: true });
    }
    catch (err) {
        console.log('Logout failed:', err);
        res.status(500).send('Internal Server Error');
    }
}