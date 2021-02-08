function oauthHeader(token) {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`
        }
    }
}

module.exports = { oauthHeader }