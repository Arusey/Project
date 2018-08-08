//includes all  plugins, packages and frameworks relevant for the application
var express     = require("express"),//serverframework for node js used to to build web applications
    app         = express(),
    bodyParser  = require("body-parser"),//this is an express middleware that reads the form input and stores it as a javascript object
    MongoClient    = require("mongoose"),//this is a object modelling tool for our database
    passport    = require("passport"),//this is a middleware used to authenticate the requests sent by the user 
    cookieParser = require("cookie-parser"),//it is a middlware that parses the cookies that the user may have sent 
    LocalStrategy = require("passport-local"),//autheticates a user through their username and password
    flash        = require("connect-flash"),//displays a message to the user 
    Restaurant  = require("./models/restaurant"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),//includes the package for managing a session
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
    
// configure dotenv
require('dotenv').load();

//requiring and accessing all of our routes
var commentRoutes    = require("./routes/comments"),
    restaurantRoutes = require("./routes/restaurants"),
    indexRoutes      = require("./routes/index")
    
// assign MongoClient promise library and connect to database
MongoClient.Promise = global.Promise;

// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/restaurant_app';

// mongoose.connect(databaseUri, { useMongoClient: true show users;})
//connect to the MongoDB database
MongoClient.connect("mongodb://localhost:27017/restaurant_app", { useNewUrlParser: true })
            .then(() => console.log(`Database connected`))
            .catch(err => console.log(`Ooh noo! kuna shida mahali!: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");//allows us to use embedded javascript file format
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
//shows messages to the user of their current status 
app.use(flash());
//passoprt plugin is used to authenticate sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//authenticates the current user information
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

//this is used to access and execute all of our routes
app.use("/", indexRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:id/comments", commentRoutes);
//opens the server and listens for requests at port 3000
app.listen(3000, function(){
   console.log("The Restaurant Server Has Started!");
});