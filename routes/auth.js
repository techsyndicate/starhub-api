const router = require('express').Router();
const User = require('../models/User')
const { oauthHeader } = require('../controllers/constants')
const axios = require('axios')

router.get('/', (req, res) => {
    res.redirect('https://github.com/login/oauth/authorize?client_id=2719a726baf6fc81a4a3&scope=admin:repo_hook,admin:org_hook')
});

router.get('/success', (req, res) => {
    res.send('Authentication successful! you can now close this tab')
});

router.get('/callback', (req, res) => {
    let code = req.query.code
    axios.post('https://github.com/login/oauth/access_token', {
            client_id: '2719a726baf6fc81a4a3',
            client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
            code: code
        })
        .then(async(response) => {
            let accessToken = response.data.split('&')[0].split('=')[1]
            console.log(accessToken)
            let profileRes = await axios.get('https://api.github.com/user', oauthHeader(accessToken))
            let username = profileRes.data.login
            let id = profileRes.data.id
            User.findOne({ username: username }).then((user) => {
                if (!user) { //see if user already exists
                    let newUser = User({
                        username,
                        access_token: accessToken,
                        id
                    })
                    newUser.save()
                } else { //if user exists, update access token
                    if (accessToken != user.access_token) {
                        user.access_token = accessToken
                        user.save()
                    }
                }
            })
            res.redirect(`http://localhost:15015/callback/${accessToken}/${username}/${id}`) //redirect for chrome extension to fetch token
        })
        .catch(function(error) {
            console.log(error);
        });
})

module.exports = router;