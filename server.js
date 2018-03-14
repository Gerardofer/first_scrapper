const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/mongoHeadlines");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
    Headline.find({}, (err, allArticles) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { articles: allArticles });
        }
    });
});

// --------  POST Route to save results to the database  -----------//
app.post("/articles", (req, res) => {
    axios.get("https://www.nytimes.com").then((response) => {
        var $ = cheerio.load(response.data);
        var clip = {};

        $("article h2").each((i, element) => {

            clip.link = $(element).children("a").attr("href");
            clip.body = $(element).children("a").text();

            Headline.create(clip, (err, newClip) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Articles Posted in the Data Base");
                }
            })
        });

    });

})


app.listen(PORT, () => {
    console.log("server listening on port", PORT);
})