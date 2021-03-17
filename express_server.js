const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
  "S152tx": "https://www.tsn.ca"
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookies = require('cookie-parser');
app.use(cookies());

function generateRandomString() {
  let alphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "abcdefghijklmnopqrstuvxyz"; 
  let randomStr = [];
  for (let i =0; i < 6; i++) {
    randomStr.push(alphaNumericStr.charAt(Math.trunc(alphaNumericStr.length * Math.random())));
  }  
  return randomStr.join('');
  
}

app.get("/", (req, res) => {
  res.send("Hello World");
})

app.post("/urls/login", (req, res) => {
let username = req.body.username;
res.cookie('username', username);
const templateVars = { urls: urlDatabase, username: req.cookies["username"] }
res.render("urls_index", templateVars);
res.redirect("/urls")
})

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };
  res.render("urls_index", templateVars);
})

app.post("/urls/logout", (req, res) => {
  req.cookies["username"] = null;
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars)
  res.redirect("/urls")
});


app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURLN = "";
  shortURLN = generateRandomString();
  urlDatabase[shortURLN] = req.body.longURL;
  const templateVars = {shortURL: shortURLN, longURL: req.body.longURL, username: req.cookies["username"]};
  res.render("urls_show", templateVars)
});

app.post("/urls/:shortURL/Edit", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  let shortURLN = "";
  console.log(req.body.longURL);
  shortURLN = generateRandomString();
  urlDatabase[shortURLN] = req.body.longURL;
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  //console.log(req.params.shortURL);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.render("urls_show", templateVars);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})