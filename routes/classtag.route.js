const router = require('express').Router();
const path = require('path');



router.get('/', (req, res) => {
    res.sendFile('classtag.html', { root: path.join(__dirname, '../public') });
});



module.exports = router;