//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB"); 

const homeStartingContent = "Welcome to the Daily Journal. Here you can post stories,blogs that you want to share with world. This is a free website where you compose your memories that you want save and share with the world.";
const aboutContent = "My name is Shivang Srivastava. I am a 2nd Year B.Tech CSE student at Jaypee Institute of Information Technology,Noida. I have created this website as a challenge to test my skills as a web developer. Hope you enjoy this website.";
const contactContent = "My email address is shivangs@gmail.com. Contact me for any trouble";

let posts = [];

const postsSchema = new mongoose.Schema({
  Heading: String,
  Content: String
});

const Posts = mongoose.model("Posts",postsSchema);

app.get("/",function(req,res){
  Posts.find(function(err,posts){
    res.render("home",{homeContent: homeStartingContent,newposts: posts});
  });
});

app.get("/about",function(req,res){
  res.render("about",{aboutinfo: aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactinfo: contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postID",function(req,res){
  const pID = req.params.postID;

  Posts.findOne({_id: pID},function(err,posts){
    res.render("post",{postHeading: posts.Heading, postContent: posts.Content});
  });
});

app.post("/compose",function(req,res){
  const title = req.body.postTitle;
  const content = req.body.postBody;
  const newP = new Posts({
    Heading: title,
    Content: content
  });

  newP.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
  posts.push(newP);
  console.log("Added");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
