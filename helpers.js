//   Find a User by Email //

const getUserByEmail = function(email2, database) {
  let myUsers = Object.entries(database);
  let theUser;
  for (let i = 0; i < myUsers.length; i++) {
    if (myUsers[i][1].email === email2) {
      theUser = myUsers[i];
    }
  } 
  return theUser;
}

//   Generate a Random String   //

const generateRandomString = function() {
  let alphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvxyz"; 
  let randomString = [];
  for (let i = 0; i < 6; i++) {
    randomString.push(alphaNumericString.charAt(Math.trunc(alphaNumericString.length * Math.random())));
  }  
  return randomString.join('');
}

//  Find User Specific URLS //

const userSpecificUrls = function(urlDatabase0,userId) {
  let myArr = {};
  let myVal = Object.keys(urlDatabase0);
  for (let i = 0; i < myVal.length; i++) {
      if ((urlDatabase0[myVal[i]]).id === userId) {
        myArr[myVal[i]] = urlDatabase0[myVal[i]];
      };
  }
  return myArr;
} 


module.exports = {getUserByEmail, generateRandomString, userSpecificUrls}