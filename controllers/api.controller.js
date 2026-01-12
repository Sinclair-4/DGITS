const { getUserById } = require('../models/user.model.js');

exports.me = (req, res) => {
    console.log(req.user);
    try {
        if (!req.user) { res.status(401).send('Missing data'); }

        const userRecord = getUserById(req.user.sub);
        if (!userRecord) { res.status(404).send('User not found'); }

        res.status(200).json({
            username: userRecord.username,
            email: userRecord.email,
        });
    }
    catch (err) {
        console.log('GET /me failed:', err);
        res.status(500).send('Internal Server Error');
    }
}