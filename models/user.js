//defines the user's data model and peforms their authetication
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
//arrays of objects
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose)
//exports the userSchema model 
module.exports = mongoose.model("User", UserSchema);
