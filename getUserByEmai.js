//    Find a User by Email //

const getUserByEmail = function(email, database) {
  let myData = Object.values(database);
  let res = {};
  myData.forEach(user => {
    if (JSON.stringify(user).includes(email)) {
      console.log(user);
      return res = user;
    }
  })
};
mudule.exports = getUserByEmail