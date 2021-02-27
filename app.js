const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');

require('dotenv').config()

const app = express();

const mongoURI = process.env.DB_URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected.")
    });

app.set('view engine', 'ejs');
app.use('/public', express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.use('/', require('./routes/index'))
app.use('/webhook', require('./routes/webhook'))
app.use('/auth', require('./routes/auth'))
app.use('/repos', require('./routes/repos'))

const port = process.env.PORT || 5000;

app.listen(port, err => {
    console.log(`API listening on port ${port}.`);
    if (err) throw err;
});