const router = require('express').Router();
const axios = require('axios');
const Repo = require('../models/Repo')
const User = require('../models/User')
const GITHUB_API_URL = 'https://api.github.com'

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

router.get('/delete', (req, res) => {
    const repo = req.query.repository
    const repoOwner = req.query.repoOwner
    const token = req.query.token
    User.findOne({access_token: token}).then(user => {
        if(!user) {
            res.status(404).send({"message": "user not found"})
        } else {
            Repo.findOne({ webhookCreator: user.username, repoName: `${repoOwner}/${repo}`}).then(repoFound => {
                const webhookID = repoFound.webhookId
                Repo.findOneAndDelete({ webhookCreator: user.username, repoName: `${repoOwner}/${repo}`}).then(response => {
                    console.log(response);
                    const config = {
                        method: 'delete',
                        url: `${GITHUB_API_URL}/repos/${repoOwner}/${repo}/hooks/${webhookID}`,
                        headers: { 
                          'Authorization': `Bearer ${token}`
                        },
                      };
                      axios(config)
                      .then(m => {
                        if(m.message != "Not Found") {
                            res.send({"message":"deleted successfully"})
                        }
                      })
                })
            })
        }
    })
});

module.exports = router;