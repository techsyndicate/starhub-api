const router = require('express').Router();
const axios = require('axios');
const Repo = require('../models/Repo')

const GITHUB_API_URL = 'https://api.github.com'

router.get('/', async(req, res) => {
    const repo = req.query.repository
    const repoOwner = req.query.repoOwner
    const token = req.query.token
    const user = req.query.user
    Repo.findOne({ repoName: `${repoOwner}/${repo}` }).then((repository) => {
        if (!repository) {
            const postData = { owner: `${repoOwner}`, repo: `${repo}`, events: ['star'], config: { url: `${process.env.BASE_URL}/webhook`, content_type: 'application/json; charset=utf-8' } }
            const postConfig = {
                method: 'post',
                url: `${GITHUB_API_URL}/repos/${repoOwner}/${repo}/hooks`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                data: postData
            };
            axios(postConfig)
                .then(response => {
                    console.log(response.data);
                    let newRepo = Repo({
                        webhookCreator: user,
                        repoName: `${repoOwner}/${repo}`,
                        webhookId: response.data.id
                    })
                    newRepo.save()
                    res.send({ "message": "repo added" })
                })
                .catch(err => {
                    res.send({ "message": "error" })
                    console.log(err);
                })
        } else {
            res.send({ "message": "repo already exists" })
        }
    })
});

router.post('/', (req, res) => {
    if (JSON.parse(req.body.payload) == undefined) {
        res.send("hi")
    } else {
        const { sender, starred_at, action, repository } = JSON.parse(req.body.payload)
        const repoName = repository.full_name
        const userName = sender.login
        const userId = sender.id
        const deleted_at = new Date().toISOString()
        let data = {}
        Repo.findOne({ repoName: repoName }).then((repository) => {
            if (!repository) {
                res.send("can't find repo")
            } else {
                if (action === 'deleted') {
                    data = {
                        userName,
                        userId,
                        unstarredAt: deleted_at
                    }
                    const initialStars = repository.stars
                    const updatedStars = initialStars.filter((user) => user.userId !== userId);
                    repository.stars = updatedStars
                    repository.unstars = [...repository.unstars, data]
                    repository.save()
                } else {
                    data = {
                        userName,
                        userId,
                        starredAt: starred_at
                    }
                    const updatedUnstars = repository.unstars.filter((user) => user.userId !== userId);
                    repository.unstars = updatedUnstars
                    repository.stars = [...repository.stars, data]
                    repository.save()
                }
                res.send("updated")
            }
        })
    }
})

module.exports = router;