require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.set('strictQuery', false);
// Database Address
const url = "mongodb://127.0.0.1:27017/userDB"
// const url = "mongodb+srv://eben:eben-123@cluster0.cwc2v1f.mongodb.net/todolistDB"
  
// Connecting to database
mongoose.connect(url).then((ans) => {
    console.log("ConnectedSuccessful")
}).catch((err) => {
    console.log("Error in the Connection")
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=> {
    res.render("home");
});

app.get("/login", (req, res)=> {
    res.render("login");
});

app.get("/register", (req, res)=> {
    res.render("register");
});


app.post("/register", (req, res)=> {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err)=> {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser)=> {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
