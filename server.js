const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
})

require("./routes/apiRoutes.js")(app);

app.listen(PORT, () => {
    console.log("server listening on port", PORT);
})