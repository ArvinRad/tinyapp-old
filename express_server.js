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

function generateRandomString() {
  let alphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "abcdefghijklmnopqrstuvxyz"; 
  let randomStr = [];
  for (let i =0; i < 6; i++) {
    randomStr.push(alphaNumericStr.charAt(Math.trunc(alphaNumericStr.length * Math.random())));
  }  
  return randomStr.join('');
  
}

app.get("/", (req, res) => {
  res.send("Hello!");
})

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let shortURLN = "";
  shortURLN = generateRandomString();
  urlDatabase[shortURLN] = req.body.longURL;
  const templateVars = {shortURL: shortURLN, longURL: req.body.longURL};
  res.render("urls_show", templateVars)
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params.shortURL);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})