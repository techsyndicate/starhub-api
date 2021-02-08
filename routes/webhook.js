const router = require('express').Router();
const axios = require('axios');
const Repo = require('../models/Repo')

const GITHUB_API_URL = 'https://api.github.com'

router.get('/', async (req, res) => {
    const repo = req.query.repository
    const user = req.query.user
    const token = req.query.token
    Repo.findOne({ repoName: `${user}/${repo}` }).then((repository) => {
      if(!repository) { 
        const postData = { owner: `${user}`, repo: `${repo}`, events: ['star'], config: { url: `${process.env.BASE_URL}/webhook`, content_type: 'application/json; charset=utf-8' } }
        const postConfig = {
          method: 'post',
          url: `${GITHUB_API_URL}/repos/${user}/${repo}/hooks`,
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          },
          data : postData
        };
        axios(postConfig)
        .then(response => {
            console.log(response.data);
            let newRepo = Repo({
              repoName: `${user}/${repo}`,
              webhookId: response.data.id
            })
            newRepo.save()
            res.send("repo added")
            })
        .catch(err => {
            res.send(err)
            console.log(err);
        })
      } else {
        res.send("repo already exists")
      }
    })
});

router.post('/', (req, res) => {
  if(JSON.parse(req.body.payload) == undefined) {
    res.send("hi")
  } else {
    const { sender, starred_at, action, repository } = JSON.parse(req.body.payload)
    const repoName = repository.full_name
    const userName = sender.login
    const userId = sender.id
    const deleted_at = new Date().toISOString()
    let data = {}
    Repo.findOne({ repoName: repoName }).then((repository) => {
      if(!repository) {
        res.send("can't find repo")
      } else {
        if(action === 'deleted') {
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
          repository.stars = [...repository.stars, data]
          repository.save()
        }
        res.send("updated")
      }
    })
  }
})

module.exports = router;