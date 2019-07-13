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
    res.send('respond with a resource');
});

module.exports = router;
