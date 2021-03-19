const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

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

function userSpecificURLS(userId) {
  let myArr = {};
  let myVal = Object.keys(urlDatabase);
  for (let i = 0; i < myVal.length; i++) {
      if (JSON.stringify(urlDatabase[myVal[i]]).includes(userId)) {
        myArr[myVal[i]] = urlDatabase[myVal[i]];
      };
  }
  return myArr;
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
    res.redirect("/urls/login");
  } else {
   res.send("Error 400: Email address or password is not valid")
 }
})

//   Sign In Page  ////


app.get("/urls/login", (req, res) => {
  res.render("login");
})

//   Sign In Handler ////

app.post("/urls/login", (req, res) => {
  let username = "";
  let userId = 0;
  if (req.body.email.includes("@") && JSON.stringify(users).includes(req.body.email)) {
    for(let i = 0; i < Object.values(users).length; i++) {
      if ((Object.values(users)[i].email === req.body.email) && (Object.values(users)[i].password === req.body.password)) {
        username = Object.keys(users)[i];
        userId = Object.values(users)[i].id;
      }
    }
    res.cookie("user_ID",userId);
    res.cookie("username",username);
    res.redirect("/urls");
  } else {
   res.send("Error 403: Email address or password is not valid")
 }
})

//   Log Out Handler ////

app.post("/urls/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls/login");
});


//   Main URL Handler ////

app.get("/urls", (req, res) => {

  const urlD = userSpecificURLS(req.cookies.user_ID);
  const templateVars = { 
    urls: urlD,
    username: req.cookies.username
   };
  res.render("urls_index", templateVars);
})

//   New Short URL Page ////

app.get("/urls/new", (req, res) => {
  
  if (req.cookies.username) {
    const templateVars = {username: req.cookies.username};
    res.render("urls_new", templateVars);
  } else res.redirect("/urls/login");
  
});

//   New Short URL Handler ////

app.post("/urls", (req, res) => {
  if (req.cookies.username) {
    let shortURLN = "";
    shortURLN = generateRandomString();
    urlDatabase[shortURLN] = {"longURL": req.body.longURL, "id": req.cookies.user_ID};
    const templateVars = { urls: urlDatabase, username: req.cookies.username};
    res.render("urls_index", templateVars)
  } else res.redirect("/urls/login");  
});

//   Edit Short URL Handler ////

app.post("/urls/:shortURL/Edit", (req, res) => {
  if (urlDatabase[req.params.shortURL].id === req.cookies.user_ID) {
    delete urlDatabase[req.params.shortURL];
    console.log(req.body.longURL);
    const shortURLN = generateRandomString();
    urlDatabase[shortURLN] = {"longURL": req.body.longURL, "id": req.cookies.user_ID};
    //const urlD = userSpecificURLS(urlDatabase, req.cookies.user_ID);
    const templateVars = { urls: urlDatabase, username: req.cookies.username };
    res.render("urls_index", templateVars);
  } else res.send("You don't own this Shortened URL");
});

//   Delete Short URL Handler ////

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].id === req.cookies.user_ID) {
    delete urlDatabase[req.params.shortURL];
    //const urlD = userSpecificURLS(req.cookies.user_ID);
    const templateVars = { urls: urlDatabase, username: req.cookies.username };
    res.render("urls_index", templateVars);
  } else res.send("You don't own this Shortened URL");
});

//    Short**2 URL Handler ////

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, username: req.cookies.username};
  res.render("urls_show", templateVars);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})