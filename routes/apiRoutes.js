const request = require("request");
const cheerio = require("cheerio");

var db = require("../models");


module.exports = (app) => {
    app.get("/", (req, res) => {
        res.redirect("/articles");
    });

    app.get("/articles", (req, res) => {
        request("https://www.nytimes.com", function(err, response, html) {

            var $ = cheerio.load(html);

            var result = {};

            $("article h2").each(function(i, element) {

                result.link = $(element).children("a").attr("href");
                result.body = $(element).children("a").text();

                db.Headline.create(result)
                    .then(function(dbResult) {
                        console.log(dbResult);
                        res.render("index", { results: result });
                    });
                // console.log(result);
            })
        });

    })
}