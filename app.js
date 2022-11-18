require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

app.use(session({
    secret:"Our little secret.",
    resave :false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

//////////// Mongoose Model  ///////////

mongoose.connect("mongodb://localhost:27017/userDB");

const  userSchema = new mongoose.Schema({
    email : String,
    password : String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/////////// code here !  //////////////

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.get("/logout", function(req, res){
    req.logout(function(err){
        if(err){
            res.send(err);
        }
        else{
            res.redirect("/");
        }
    });
   
});

app.get("/secrets", function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
})


app.post("/register", function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
});



app.post("/login", function(req,res){    
    
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
            });
        }
    });
});



app.listen(3000, function(){
    console.log('server is running on port 3000');
})


