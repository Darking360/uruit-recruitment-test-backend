const { UserModel: User } = require("./model");
const { check } = require("express-validator/check");
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const { validateMongooseType } = require('../games/controller');

// Validations

const validate = method => {
  switch (method) {
    case "createUser": {
      return [check("username", "username is required").exists()];
    }
    case "getUser": {
      return [
        check("_id", "_id is required").exists(),
        body('passwordConfirmation').custom(validateMongooseType)
      ];
    }
    case "deleteUser": {
      return [
        check("_id", "_id is required").exists(),
        body('passwordConfirmation').custom(validateMongooseType)
      ];
    }
    case "updateUser": {
      return [
        check("_id", "_id is required").exists(),
        body('passwordConfirmation').custom(validateMongooseType)
      ];
    }
  }
};

// CRUD

async function createUser(username) {
  try {
    // If user already exists, retrieve and return that one
    const [oldUser] = await getUsers({ username });
    if (oldUser) { return oldUser };
    const newUser = await User.create({ username });
    return newUser;
  } catch (error) {
    console.error("Error got from Mongo - creation :: ", error);
    return error;
  }
}

async function getUser(_id) {
  try {
    const user = await User.findOne({ _id: new ObjectId(_id) });
    return user;
  } catch (error) {
    console.error("Error got from Mongo - get single :: ", error);
    return error;
  }
}

async function getUsers(params = {}) {
  try {
    const users = await User.find({ ...params });
    return users;
  } catch (error) {
    console.error("Error got from Mongo - get multiple :: ", error);
    return error;
  }
}

async function deleteUser(_id) {
  try {
    await User.deleteMany({ _id: new ObjectId(_id) });
    return true;
  } catch (error) {
    console.error("Error got from Mongo - delete :: ", error);
    return error;
  }
}

async function updateUser(_id, updateData = {}) {
  try {
    const user = await User.findOne({ _id: new ObjectId(_id) });
    Object.keys(updateData).forEach(key => {
      user[key] = updateData[key];
    });
    await user.save();
    return user;
  } catch (error) {
    console.error("Error got from Mongo - delete :: ", error);
    return error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  validate
};
