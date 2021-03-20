const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const helper = require('./helpers');


app.set("view engine", "ejs");
//   Database  ///
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", id: 20 },
  "9sm5xk": { longURL: "http://www.google.com", id: 20 },
  "S152tx": { longURL: "https://www.tsn.ca", id: 21 }
};

const users = {
  Alice: {
    id: 20,
    email: "alice@ieee.org",
    password: '1234'
  },
  kian: {
    id: 21,
    email: "kian@gmail.com",
    password: '3654'
  }
};

//    Middleware ///

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


//   Home Page ////
app.get("/", (req, res) => {
  res.send("Hello World");
});

//   Register Page  ////


app.get("/urls/register", (req, res) => {
  res.render("register");
});

//   Registration Handler ////

app.post("/urls/register", (req, res) => {

  let userId = Math.trunc(1000 * Math.random());
  if (req.body.email.includes("@") && !JSON.stringify(users).includes(req.body.email)) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    users[req.body.name] = { "id": userId, "email": req.body.email, "password": hashedPassword};
    res.redirect("/urls/login");
  } else {
  res.send("Error 400: Email address or password is not valid");
  }
});

//   Sign In Page  ////


app.get("/urls/login", (req, res) => {
  res.render("login");
});

//   Sign In Handler ////

app.post("/urls/login", (req, res) => {
  if (req.body.email.includes("@")) {
    let user = helper.getUserByEmail(req.body.email, users);
    if (user && bcrypt.compareSync(req.body.password, user[1].password)) {
      req.session.user_ID = user[1].id;
      req.session.username = user[0];
      res.redirect("/urls");
    } else {
      res.send("Error 403: Email address or password is not valid");
    }
  } else {
  res.send("Error 403: Email address or password is not valid");
  }
});

//   Log Out Handler ////

app.post("/urls/logout", (req, res) => {
  req.session.user_ID = null;
  req.session.username = null;
  res.redirect("/urls/login");
});


//   Main URL Handler ////

app.get("/urls", (req, res) => {

  const urlD = helper.userSpecificURLS(urlDatabase, req.session.user_ID);
  const templateVars = { 
    urls: urlD,
    username: req.session.username
  };
  res.render("urls_index", templateVars);
});

//   New Short URL Page ////

app.get("/urls/new", (req, res) => {
  
  if (req.session.username) {
    const templateVars = {username: req.session.username};
    res.render("urls_new", templateVars);
  } else res.redirect("/urls/login");
  
});

//   New Short URL Handler ////

app.post("/urls", (req, res) => {
  if (req.session.username) {
    let shortURLN = "";
    shortURLN = helper.generateRandomString();
    urlDatabase[shortURLN] = {"longURL": req.body.longURL, "id": req.session.user_ID};
    const templateVars = { urls: urlDatabase, username: req.session.username};
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/urls/login");
  }  
});

//   Edit Short URL Handler ////

app.post("/urls/:shortURL/Edit", (req, res) => {
  if (urlDatabase[req.params.shortURL].id === req.session.user_ID) {
    delete urlDatabase[req.params.shortURL];
    console.log(req.body.longURL);
    const shortURLN = helper.generateRandomString();
    urlDatabase[shortURLN] = {"longURL": req.body.longURL, "id": req.session.user_ID};
    const templateVars = { urls: urlDatabase, username: req.session.username };
    res.render("urls_index", templateVars);
  } else res.send("You don't own this Shortened URL");
});

//   Delete Short URL Handler ////

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].id === req.session.user_ID) {
    delete urlDatabase[req.params.shortURL];
    const templateVars = { urls: urlDatabase, username: req.session.username };
    res.render("urls_index", templateVars);
  } else res.send("You don't own this Shortened URL");
});

//    Short**2 URL Handler ////

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, username: req.session.username};
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


