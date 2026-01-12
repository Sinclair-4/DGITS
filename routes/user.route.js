const router = require('express').Router();
const { authenticateToken } = require('../middlewares/auth.middleware.js');
const path = require('path');

router.get('/', authenticateToken, (req, res) => {
    try {
        res.sendFile(
            'user.html', 
            { root: path.join(__dirname, '../public') }
        );
    } 
    catch (err) {
        console.log('Get user failed:', err);
        res.status(500).send('Internal Server Error');
    };
});

module.exports = router;