require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

//////////// Mongoose Model  ///////////

mongoose.connect("mongodb://localhost:27017/userDB");

const  userSchema = new mongoose.Schema({
    email : String,
    password : String
});



const User = new mongoose.model("User", userSchema);

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


app.post("/register", function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email : req.body.username,
            password : hash
        });

        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets")
            }
        });
    });
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    res.send("wrong password");
                }
            }
        }
    })

})



app.listen(3000, function(){
    console.log('server is running on port 3000');
})


