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

//------------------------  COLLECTIONS SET UP  -------------------------//

let Schema = mongoose.Schema
//Note Collection

var NoteSchema = new Schema({
    note: String
});

let Note = mongoose.model("Note", NoteSchema);
//Article Collection
var HeadlineSchema = new Schema({
    link: String,
    header: String,
    body: String,
    saved: false,
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
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
        var articles = {};

        $("div.collection article").each((i, element) => {
            
                articles.link = $(element).find("h2").children("a").attr("href");
                articles.header = $(element).find("h2").children("a").text();
                articles.body = $(element).find("p.summary").text();
                articles.saved = false;
            
            if (articles.link && articles.header && articles.body){
                Headline.create(articles, (err, postedArticles) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
        res.redirect('/articles');
    });
});

//  GET route to update the "saved" property to "true".
app.get("/saved/:id", (req, res) => {
    let id = req.params.id;
    Headline.findByIdAndUpdate(id, {$set : {saved : true}}, (err, savedArticle) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/articles");
        }
    });
});

//  -----------------  GET route to get all "Saved" articles ----------------------//

app.get("/articles/saved", (req, res) => {
    Headline.find({saved: true}, (err, savedArticle) => {
        if(err) {
            res.redirect("/articles");
        } else {
            res.render("show", {savedArticle: savedArticle});
        }
    });
});

//  --------------------  GET route to get saved article  ----------------------//
app.get("/articles/saved/edit/:id", (req, res) => {
    let id = req.params.id;
    Headline.findById(id).populate("note").then(savedNote => {
            res.render("note", {articleNote: savedNote})
        }).catch(err => {
            console.log(err);
        });
});

//  ---------------  POST route to create a new note and update with new notes -----//
app.post("/articles/saved/:id", (req, res) => {
    Note
})
// app.post("/articles/saved/:id", (req, res) => {
//     let id = req.params.id
//     let note = req.body.note;

//     console.log(note);
    // Note.create(note).then(newNote => {
    //     return Headline.findByIdAndUpdate({id: id}, {note: newNote._id}, {new: true}).then(savedNote => {
    //         res.render("note", {articleNote: savedNote})
    //         console.log(note)
    //     }).catch(err => {
    //         console.log (err)
    //     })
    // })
// })


app.listen(PORT, () => {
    console.log("server listening on port", PORT);
});
