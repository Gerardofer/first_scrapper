module.exports = (app) => {
    app.get("/", (req, res) => {
        res.redirect("/articles");
    });

    app.get("/articles", (req, res) => {
        res.render("index")
    });
}