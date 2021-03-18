const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
//   Database  ///
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com",
  "S152tx": "https://www.tsn.ca"
}

const users = {
  Alice: {
    id: 20,
    email: "alice@ieee.org",
    password: '2652'
  },
  kian: {
    id: 21,
    email: "kian@gmail.com",
    password: '3654'
  }
}

//    Middleware ///

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//    Callbacks ///

function generateRandomString() {
  let alphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "abcdefghijklmnopqrstuvxyz"; 
  let randomStr = [];
  for (let i =0; i < 6; i++) {
    randomStr.push(alphaNumericStr.charAt(Math.trunc(alphaNumericStr.length * Math.random())));
  }  
  return randomStr.join('');
}


//   Home Page ////
app.get("/", (req, res) => {
  res.send("Hello World");
})

//   Register Page  ////


app.get("/urls/register", (req, res) => {
  res.render("register");
})

//   Registration Handler ////

app.post("/urls/register", (req, res) => {

  let userId = Math.trunc(1000 * Math.random());
  if (req.body.email.includes("@") && !JSON.stringify(users).includes(req.body.email)) {
    users[req.body.name] = { "id": userId, "email": req.body.email, "password": req.body.password};
//    console.log(users);
//    console.log(JSON.stringify(users));   
    res.redirect("/urls/login");
  } else {
   res.send("Error 400: Email address aleady exists or not valide")
 }
})

//   Sign In Page  ////


app.get("/urls/login", (req, res) => {
  res.render("login");
})

//   Sign In Handler ////

app.post("/urls/login", (req, res) => {
    console.log(Object.values(users))
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.email.includes("@"));
    let username = "";
    let userId = 0;
  if (req.body.email.includes("@") && JSON.stringify(users).includes(req.body.email)) {
    for(let i = 0; i < Object.values(users).length; i++) {
      if ((Object.values(users)[i].email === req.body.email) && (Object.values(users)[i].password === req.body.password)) {
        username = Object.keys(users)[i];
        userId = Object.values(users)[i].id;
        console.log(username);
      }
    }
    console.log(userId);
    res.cookie("user_ID",userId);
    res.cookie("username",username);
    res.redirect("/urls");
  } else {
   res.send("Error 403: Email address is not valide")
 }
})


//   Main URL Handler ////

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies.username
   };
  res.render("urls_index", templateVars);
})

//   Log Out Handler ////

app.post("/urls/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls/login")
});

//   New Short URL Page ////

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies.username};
  res.render("urls_new", templateVars);
});

//   New Short URL Handler ////

app.post("/urls", (req, res) => {
  let shortURLN = "";
  shortURLN = generateRandomString();
  urlDatabase[shortURLN] = req.body.longURL;
  const templateVars = {shortURL: shortURLN, longURL: req.body.longURL, username: req.cookies.username};
  res.render("urls_show", templateVars)
});

//   Edit Short URL Handler ////

app.post("/urls/:shortURL/Edit", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  let shortURLN = "";
  console.log(req.body.longURL);
  shortURLN = generateRandomString();
  urlDatabase[shortURLN] = req.body.longURL;
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

//   Delete Short URL Handler ////

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

//    Short**2 URL Handler ////

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies.username};
  res.render("urls_show", templateVars);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})