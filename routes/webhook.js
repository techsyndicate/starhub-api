const router = require('express').Router();
const axios = require('axios');
const { oauthHeader } = require('../controllers/constants')

const GITHUB_API_URL = 'https://api.github.com'

router.get('/', async(req, res) => {
    const repo = req.query.repository
    const user = req.query.user
    const token = req.query.token
    await axios.post(`${GITHUB_API_URL}/repos/${user}/${repo}/hooks`, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }, { owner: `${user}`, repo: `${repo}`, config: { url: `${process.env.BASE_URL}/webhook`, content_type: 'json' }, events: ['star'] })
        .catch(err => {
            console.log(err)
        }).then(res => {
            console.log(res)
        })

});

router.post('/', (req, res) => {
    const { sender, starred_at, action, repository } = req.body
    const repoName = repository.name
    const repoStarrer = sender.login
    const deleted_at = new Date().toISOString()
        // write logic
    res.send("done")
})

module.exports = router;