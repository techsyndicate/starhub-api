const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('API for StarHub - a tool that tracks your GitHub stars so you don\'t have to.');
});

module.exports = router;