const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");

var db = require("../models");

module.exports = (app) => {
    // app.get("/", (req, res) => {
    //     // res.redirect("/articles");
    //     res.render("home");
    // });

    // app.get("/articles", (req, res) => {
    //     res.render("index");
    // })

    // app.post("/articles", (req, res) => {
    //     axios.get("https://www.nytimes.com").then((response) => {
    //         var $ = cheerio.load(response.data);
    //         var clip = {};

    //         $("article h2").each((i, element) => {

    //             clip.link = $(element).children("a").attr("href");
    //             clip.body = $(element).children("a").text();

    //             db.Headline.create(clip, (err, newClip) => {
    //                 if (err) {
    //                     console.log(err);
    //                 } else {
    //                     console.log("Articles Posted in the Data Base");
    //                 }
    //             })
    //         });

    //     });

    // })

};