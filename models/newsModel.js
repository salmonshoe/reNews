const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema ({
    //headline: the title of the article and trim the leading or trailing whitespace before saving
    headline: {
        type: String,
        trim: true,
        required: 'Headline title is required'
    },
    //summary: a short summary of the article
    summary: {
        type: String,
        trim: true
    },
    //URL is the url to the original article
    url: {
        type: String,
        required: 'URL source to original article is required'
    }
    //FEEL FREE TO ADD IN A VIDEO CONTENT TO THE DATABASE
});

// To create the model from the above schema code, using the mongoose model method
const News = mongoose.model("News", NewsSchema);

module.exports = News;