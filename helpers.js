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

const generateRandomString = function() {
  let alphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "abcdefghijklmnopqrstuvxyz"; 
  let randomStr = [];
  for (let i = 0; i < 6; i++) {
    randomStr.push(alphaNumericStr.charAt(Math.trunc(alphaNumericStr.length * Math.random())));
  }  
  return randomStr.join('');
}

const userSpecificURLS = function(urlDatabase0,userId) {
  let myArr = {};
  let myVal = Object.keys(urlDatabase0);
  for (let i = 0; i < myVal.length; i++) {
      if ((urlDatabase0[myVal[i]]).id === userId) {
        myArr[myVal[i]] = urlDatabase0[myVal[i]];
      };
  }
  return myArr;
} 


module.exports = {getUserByEmail, generateRandomString, userSpecificURLS}