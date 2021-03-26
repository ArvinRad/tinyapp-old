const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const helper = require('./helpers');

app.set("view engine", "ejs");

//    Middleware //

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//   Database Structure  //

const urlDatabase = {};
const users = {};

//   Home Page //
app.get("/", (req, res) => {
  res.render("home");
});

//   Register Page  //

app.get("/register", (req, res) => {
  res.render("register");
});

//   Registration Handler //

app.post("/register", (req, res) => {

  let userId = Math.trunc(1000 * Math.random());
  if (req.body.email.includes("@") && !JSON.stringify(users).includes(req.body.email)) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    users[req.body.name] = { "id": userId, "email": req.body.email, "password": hashedPassword};
    res.redirect("/login");
  } else {
  res.send("Error 400: Email address or password is not valid or already used. Using your browser bottom, please return to the register page or to sign in page if you have already an account.");
  }
});

//   Sign In Page  //


app.get("/login", (req, res) => {
  res.render("login");
});

//   Sign In Handler //

app.post("/login", (req, res) => {
  if (req.body.email.includes("@")) {
    let user = helper.getUserByEmail(req.body.email, users);
    if (user && bcrypt.compareSync(req.body.password, user[1].password)) {
      req.session.user_ID = user[1].id;
      req.session.username = user[0];
      res.redirect("/urls");
    } else {
      res.send("Error 403: Email address or password is not valid. Please return to login page using your browser bottom.");
    }
  } else {
  res.send("Error 403: Email is not valid. Please return to login page using your browser bottom.");
  }
});

//   Log Out Handler //

app.post("/logout", (req, res) => {
  req.session.user_ID = null;
  req.session.username = null;
  res.redirect("/login");
});


//   Main URL Handler //

app.get("/urls", (req, res) => {
   const urlD = helper.userSpecificURLS(urlDatabase, req.session.user_ID);
    const templateVars = { 
      urls: urlD, 
      username: req.session.username
    };
    res.render("urls_index", templateVars);
});

//   New Short URL Page //

app.get("/urls/new", (req, res) => {
  
  if (req.session.username) {
    const templateVars = {username: req.session.username};
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

//   New Short URL Handler //

app.post("/urls", (req, res) => {
  if (req.session.username) {
    let shortURLN = "";
    shortURLN = helper.generateRandomString();
    urlDatabase[shortURLN] = {"longURL": req.body.longURL, "id": req.session.user_ID};
    const urlD = helper.userSpecificURLS(urlDatabase, req.session.user_ID);
    const templateVars = { 
      urls: urlD, 
      username: req.session.username
    };
    res.redirect(req.body.longURL);
  } else {
    res.redirect("/login");
  }  
});

//   Edit Short URL Handler //

app.post("/urls/:shortURL/Edit", (req, res) => {
  if (urlDatabase[req.params.shortURL].id === req.session.user_ID) {
    delete urlDatabase[req.params.shortURL];
    urlDatabase[helper.generateRandomString()] = {"longURL": req.body.longURL, "id": req.session.user_ID};
    const templateVars = { 
      urls: helper.userSpecificURLS(urlDatabase, req.session.user_ID), 
      username: req.session.username
    };
    res.render("urls_index", templateVars);
  } else res.send("You don't own this Shortened URL");
});

//   Delete Short URL Handler //

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].id === req.session.user_ID) {
    delete urlDatabase[req.params.shortURL];
    const urlD = helper.userSpecificURLS(urlDatabase, req.session.user_ID);
    const templateVars = { 
      urls: urlD, 
      username: req.session.username
    };
    res.render("urls_index", templateVars);
  } else res.send("You don't own this Shortened URL");
});

//    Short**2 URL Handler //

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.send("This short URL does NOT exist. Please return to sign in page using browser key.")
    setTimeout(res.redirect("/home"), 1000);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.session.username) {
    const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, username: req.session.username};
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/login");
  }
  
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


