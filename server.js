const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const methodOverride = require("method-override");
const app = express();

const PORT = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/mongoHeadlines");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//------------------------  COLLECTIONS SET UP  -------------------------
var HeadlineSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    // note: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Note"
    // }
});

var Headline = mongoose.model("Headline", HeadlineSchema);

//--------------------------------  END OF COLLECTIONS  ---------------------------//

//------------------------------  API ROUTES  -------------------------------------//
app.get("/", (req, res) => {
    res.render("home");
});

// --------  GET Route to render all the articles  -----------------//

app.get("/articles", (req, res) => {
    axios.get("https://www.nytimes.com").then((response) => {
        var $ = cheerio.load(response.data);
        var articles = {};

        $("article h2").each((i, element) => {

            articles.link = $(element).children("a").attr("href");
            articles.body = $(element).children("a").text();

            // console.log(clip.link);
            // console.log(clip.body);
            console.log(articles);
        });
        res.render("index", { articles: articles });
    });
});
//  -------------------  GET route to show specific item  -----------------  //
app.get("/articles/:id", (req, res) => {
    let id = req.params.id;
    Headline.findById(id, (err, articleFound) => {
        if (err) {
            res.redirect("/articles");
        } else {
            res.render("show", { article: articleFound });
        }
    })
})

app.listen(PORT, () => {
    console.log("server listening on port", PORT);
})