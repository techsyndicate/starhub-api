const router = require('express').Router();
const Repo = require('../models/Repo')
const User = require('../models/User')

router.get('/', (req, res) => {
    const token = req.query.token
    User.findOne({access_token: token}).then(user => {
        if(!user) {
            res.status(404).send("user not found")
        } else {
            Repo.find({ webhookCreator: user.username}).then(repos => {
                if(repos.length == 0) {
                    res.send({"message":"no repos found"})
                }
                else {
                    res.send(repos);
                }
            })
        }
    })
});

module.exports = router;