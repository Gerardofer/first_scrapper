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
    },
    body: {
        type: String,
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
    Headline.find({}, (err, allArticles) => {
        if (err){
            res.redirect("/");
        } else {
            res.render("index", {articles: allArticles});
        }
    })
})

//------  GET Route to scrap the content from the website and post to the database------// 
app.get("/scrapped", (req, res) => {
    axios.get("https://www.nytimes.com").then((response) => {
        var $ = cheerio.load(response.data);

        $("article h2").each((i, element) => {
            var articles = {
                link: $(element).children("a").attr("href"),
                body: $(element).children("a").text(),
                saved: false
            };
            Headline.create(articles, (err, postedArticles) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
    res.redirect("/articles")
});

//  -----------------  GET route to get all "Saved" articles ----------------------//
app.get("/articles/saved", (req, res) => {
    Headline.find().where({saved: true}, (err, savedArticle) => {
        if(err) {
            res.redirect("/articles");
        } else {
            res.render("show", {savedArtice: savedArticle});
        }
    });
});

//  -------------------  PUT route to update article to "save" specific item  -----------------  //
//Check put statement
app.put("/articles/save/:id", (req, res) => {
    let id = req.params.id;
    Headline.findByIdAndUpdate(id, {$set: {saved: true}}, (err, articleUpdate) => {
        if (err) {
            res.redirect("/articles");
        } else {
            res.redirect("/articles/saved");
        }
    });
});

app.listen(PORT, () => {
    console.log("server listening on port", PORT);
});