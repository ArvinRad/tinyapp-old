const { assert } = require('chai');

const { helper } = require('./helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = helper.getUserByEmail("user@example.com", testusers)
    const expectedOutput = "userRandomID";
    assert.equal(user[1].id, expectedOutput);
// Write your assert statement here
  });
});
  describe('express_server', function() {
    it('should return undefined for an invalid user email', function() {
      const user = express_server("user@example.com")
      const expectedOutput = "undefined";
      assert.equal(user, expectedOutput);
  });
});