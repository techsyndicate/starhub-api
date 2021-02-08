const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('API for StarHub - a tool that tracks your GitHub stars so you don\'t have to.');
});

router.post('/webhook', (req, res)=> {
	const { sender, starred_at, action, repository  } = req.body
	const repoName = repository.name
	const repoStarrer = sender.login
	const deleted_at = new Date().toISOString()
	// write logic
	res.send("done")
})

module.exports = router;