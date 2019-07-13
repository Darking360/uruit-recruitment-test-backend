const { UserModel: User } = "./model";
const { body } = require("express-validator/check");

// Validations

exports.validate = method => {
  switch (method) {
    case "createUser": {
      return [body("username", "username is required").exists()];
    }
    case "getUser": {
      return [body("_id", "_id is required").exists()];
    }
    case "deleteUser": {
      return [body("_id", "_id is required").exists()];
    }
    case "updateUser": {
      return [
        body("_id", "_id is required").exists()
      ];
    }
  }
};

// CRUD

async function createUser(username) {
  try {
    const newUser = await User.create({ username });
    return newUser;
  } catch (error) {
    console.error("Error got from Mongo - creation :: ", error);
    return error;
  }
}

async function getUser(_id) {
  try {
    const user = await User.findOne({ _id });
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
    await User.deleteMany({ _id });
    return true;
  } catch (error) {
    console.error("Error got from Mongo - delete :: ", error);
    return error;
  }
}

async function updateUser(_id, updateData = {}) {
  try {
    const user = await User.findOne({ _id });
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

exports = {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser
};
