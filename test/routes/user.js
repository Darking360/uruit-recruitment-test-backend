let mongoose = require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/test`);
let {
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    getUserByUsername,
    addGameToUser
} = require('../../models/users/controller');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();

function throwError(instance) {
    if (instance) {
        return instance;
    } else {
        throw new Error(instance.error);
    }
}

describe("User's controllers", function() {
  
    it("creates a user", async () => {
        const user = {
            username: 'miguel',
            avatar: 'some'
        };
        const createdUser = await createUser(user.username, user.avatar);
        if (createdUser && !createdUser.err) {
            return createdUser;
        } else {
            throw new Error(createdUser.error)
        }
    });

    it("gets a user", async () => {
        const user = {
            username: 'miguel',
            avatar: 'some'
        };
        const createdUser = await createUser(user.username, user.avatar);
        if (throwError(createdUser)) {
            // User created! Now retrieve
            const gotUser = await getUser(createdUser._id);
            return throwError(gotUser);
        }
    });

    it("gets all users", async () => {
        const allUsers = await getUsers();
        if (throwError(allUsers)) {
            if (allUsers.length >= 0) {
                return true
            } else {
                throw new Error("Error fetching users");
            }
        }
    });

    it("deletes a user", async () => {
        const user = {
            username: 'nonsense',
            avatar: 'some'
        };
        const createdUser = await createUser(user.username, user.avatar);
        if (throwError(createdUser)) {
            // User created! Now retrieve
            const deleted = await deleteUser(createdUser._id);
            if (deleted) {
                return true
            } else {
                throw new Error("Error deleting user")
            }
        }
    });

    it("updates a user", async () => {
        const user = {
            username: 'toupdate',
            avatar: 'some'
        };
        await deleteUser(null, { username: 'randomname' });
        const createdUser = await createUser(user.username, user.avatar);
        if (throwError(createdUser)) {
            // User created! Now retrieve
            const gotUser = await updateUser(createdUser._id, { username: 'randomname' });
            if (throwError(gotUser) && gotUser.username === 'randomname') {
                return true;
            } else {
                throw new Error("Error updating user");
            }
        }
    });

});