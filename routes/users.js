var express = require('express');
var router = express.Router();
const {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  validate
} = require('../models/users/controller');

// CRUD

router.get('/', 
  // validate('createUser'),
  function(req, res, next) {
    // Get all users
    const users = getUsers();
    if (users.err) {
      res.status(500);
      res.send('Internal error querying');
    }
    res.status(200);
    res.send(users);
});

module.exports = router;
