const mongoose = require("mongoose");

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

module.exports = Headline;