const express = require('express');
const logger = require("morgan");
const mongoose = require('mongoose');

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
// app.engine('handlebars', exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/reNews", { useNewUrlParser: true });

// For Mongo Deployment
var MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_MLAB;

mongoose.connect(MONGODB_URI);


// Routing
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

app.get('/articles/:id', (req, res) => {
    db.News.findOne({ _id: req.params.id })
      .populate("note")
      .then((dbNews) => {
          res.json(dbNews);
      })
      .catch((err) => {
          res.json(err);
      });
});

app.post('/articles/:id', (req, res) => {
    db.Note.create(req.body)
      .then((dbNote) => {
          return db.News.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then((dbNews) => {
          res.json(dbNews);
      })
      .catch((err) => {
          res.json(err);
      });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
})