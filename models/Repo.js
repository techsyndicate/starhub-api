const mongoose = require('mongoose');

const RepoSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    repoName: {
        type: String,
        required: true
    },
    stars: {
        type: Array,
        default: [],
        required: false,
    },
    unstars: {
        type: Array,
        default: [],
        required: false,
    }
})

const Repo = mongoose.model('Repo', RepoSchema);

module.exports = Repo;