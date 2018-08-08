//declaration of the object model format the comments will be stored in
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
//exports the commentSchema object model
module.exports = mongoose.model("Comment", commentSchema);