const express = require('express');
const mongoose = require('mongoose');
// Scraping Tools
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = 4050;
const db = require('./models/newsModel');
const app = express();

// Parse request body as JSON and make public the static folder to use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/reNews', { useNewUrlParser: true });

app.get('/scrape', (req, res) => {
    axios.get('https://skateboarding.transworld.net/news/').then((response) => {
        const $ = cheerio.load(response.data);

        $('div.article__title').each(function(i, element) {
            let result = {};

            result.title = $(this)
            .children("a")
            .text();

            db.News.create(result)
              .then(function(dbArticle) {
                  console.log(dbArticle);
              })
              .catch(function(err) {
                  console.log(err);
              });
        });

        res.send('Scrape Complete?');
    });
});

app.get('/articles', (req, res) => {
    db.
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})