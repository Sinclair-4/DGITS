require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/user.model');
const { verifyRefreshToken } = require('../controllers/auth.controller');
// exports.authenticateToken = (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) { res.status(400).send('Missing token'); return; };
        
//         const user = jwt.verify(token, process.env.ACCESS_TOKEN);
//         if (!user) { res.status(401).send('Invalid token'); return; };

//         const userRecord = getUserById(user.sub);
//         if (userRecord.ver !== user.ver) 
//         { res.status(401).send('Invalid token'); return; }; 

//         req.user = user;
//         console.log('req.user: ', req.user);
//         next();
//     }
//     catch (err) {
//         console.log('Authenticate token failed:', err);
//         res.status(500).send('Internal Server Error');
//     }
// }



exports.authenticateToken = async (req, res, next) => {
    console.log();
    try {
        const token = req.cookies.token;
        if (!token) { 

            console.log('auth.middleware: Missing token');

            console.log('auth.middleware: refreshToken:', req.cookies.refreshToken);

            // const refreshToken = req.cookies.refreshToken;
            // if (!refreshToken) 
            // { res.status(400).send('Missing refresh token'); return; }

            // const refTokenDecoded = verifyRefreshTooken(refreshToken);
            // if (!refTokenDecoded) 
            // { res.status(401).send('Invalid token'); return; }

            // const userRecord = getUserById(refTokenDecoded.sub);
            // if (userRecord.ver !== refTokenDecoded.ver) 
            // { res.status(401).send('Invalid token'); return; }
        
            const refreshUrl = 'https://dgits.online/auth/refresh';

            const response = await fetch(refreshUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' 
            });

            const msg = await response.text();

            if (!response.ok) 
            { 
                res.status(401).send('Invalid token'); 
                console.log('auth.middleware: Token refresh failed');
                console.log('auth.middleware: Response status:', response.status);
                console.log('auth.middleware: Response message:', msg);
                return; 
            }
            else { 
                console.log('auth.middleware: Token refreshed successfully');   
                console.log('auth.middleware: Response message:', msg);
            }
        };
        
        const user = jwt.verify(token, process.env.ACCESS_TOKEN);
        if (!user) { res.status(401).send('Invalid token'); return; };

        const userRecord = getUserById(user.sub);
        if (userRecord.ver !== user.ver) 
        { res.status(401).send('Invalid token'); return; }; 

        req.user = user;

        console.log('auth.middleware: Authentiaction successful');
        console.log('auth.middleware: req.user: ', req.user);

        console.log('auth.middleware: req.cookies.token: ', req.cookies.token);
        console.log('auth.middleware: req.cookies.refreshToken: ', req.cookies.refreshToken);

        next();
    }
    catch (err) {
        console.log('Authenticate token failed:', err);
        res.status(500).send('Internal Server Error');
    }
}