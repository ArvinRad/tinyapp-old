const getUserByEmail = function(email2, database) {
  let myUsers = Object.entries(database);
  let theUser = false;
  for (let i =0; i < myUsers.length; i++) {
    if (myUsers[i][1].email == email2) {
      theUser = myUsers[i];
    }
  } 
  return theUser;
}

const generateRandomString = function() {
  let alphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "abcdefghijklmnopqrstuvxyz"; 
  let randomStr = [];
  for (let i =0; i < 6; i++) {
    randomStr.push(alphaNumericStr.charAt(Math.trunc(alphaNumericStr.length * Math.random())));
  }  
  return randomStr.join('');
}

const userSpecificURLS = function(urlDatabase,userId) {
  let myArr = {};
  let myVal = Object.keys(urlDatabase);
  for (let i = 0; i < myVal.length; i++) {
      if (JSON.stringify(urlDatabase[myVal[i]]).includes(userId)) {
        myArr[myVal[i]] = urlDatabase[myVal[i]];
      };
  }
  return myArr;
} 


module.exports = {getUserByEmail: getUserByEmail, generateRandomString: generateRandomString, userSpecificURLS: userSpecificURLS}