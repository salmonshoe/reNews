const express = require('express');
const logger = require("morgan");
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

// Scraping Tools
const axios = require('axios');
const cheerio = require('cheerio');

const db = require("./models");
const PORT = 4050;
const app = express();

// Parse request body as JSON and make public the static folder to use
app.use(logger("dev"));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/reNews", { useNewUrlParser: true });

// Routing
app.get('/', (req, res) => {
    res.render('home');
});

app.get("/scrape", (req, res) => {
    axios.get("https://skateboarding.transworld.net/tag/best-of-web/").then(function (response) {
        const $ = cheerio.load(response.data);

        $("div.article__text").each(function (i, element) {
            var result = {};

            result.headline = $(element).children("h2").children("a").text();
            result.summary = $(element).children("p").text();
            result.url = $(element).children("h2").children("a").attr("href");

            db.News.create(result)
                .then(function (dbNews) {
                    console.log(dbNews);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Scrape Complete!");
    });
});

app.get('/articles', (req, res) => {
    db.News.find({})
        .then(function (dbNews) {
            res.json(dbNews);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})