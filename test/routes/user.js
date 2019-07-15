let mongoose = require("mongoose");
if (process.env.MONGODB_URI) {
  // Check for local usage later
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(`mongodb://mongo:27017`);
}
let {
  createUser,
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  getUserByUsername,
  addGameToUser
} = require("../../models/users/controller");

//Require the dev-dependencies
let chai = require("chai");
const expect = chai.expect;
let chaiHttp = require("chai-http");
let server = require("../../app");
let should = chai.should();

function throwError(instance) {
  if (instance && !instance.err) {
    return instance;
  } else {
    throw new Error(instance.error);
  }
}

chai.use(chaiHttp);

describe("User's controllers", function() {
  it("creates a user", async () => {
    const user = {
      username: "miguel",
      avatar: "some"
    };
    const createdUser = await createUser(user.username, user.avatar);
    if (createdUser && !createdUser.err) {
      return createdUser;
    } else {
      throw new Error(createdUser.error);
    }
  });

  it("gets a user", async () => {
    const user = {
      username: "miguel",
      avatar: "some"
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
        return true;
      } else {
        throw new Error("Error fetching users");
      }
    }
  });

  it("deletes a user", async () => {
    const user = {
      username: "nonsense",
      avatar: "some"
    };
    const createdUser = await createUser(user.username, user.avatar);
    if (throwError(createdUser)) {
      // User created! Now retrieve
      const deleted = await deleteUser(createdUser._id);
      if (deleted) {
        return true;
      } else {
        throw new Error("Error deleting user");
      }
    }
  });

  it("updates a user", async () => {
    const user = {
      username: "toupdate",
      avatar: "some"
    };
    await deleteUser(null, { username: "randomname" });
    const createdUser = await createUser(user.username, user.avatar);
    if (throwError(createdUser)) {
      // User created! Now retrieve
      const gotUser = await updateUser(createdUser._id, {
        username: "randomname"
      });
      if (throwError(gotUser) && gotUser.username === "randomname") {
        return true;
      } else {
        throw new Error("Error updating user");
      }
    }
  });

  it("gives error on already used username for update", async () => {
    const user = {
      username: "toupdate",
      avatar: "some"
    };
    const createdUser = await createUser(user.username, user.avatar);
    if (throwError(createdUser)) {
      // User created! Now retrieve
      const gotUser = await updateUser(createdUser._id, {
        username: "randomname"
      });
      if (gotUser.err) {
        return true;
      } else {
        throw new Error("Error updating user");
      }
    }
  });

  it("adds a game to user's games", async () => {
    const user = {
      username: "miguel",
      avatar: "some"
    };
    const gameId = "5d2bd7e78d9b260631473f84";
    const createdUser = await createUser(user.username, user.avatar);
    if (throwError(createdUser)) {
      const gotUser = await getUser(createdUser._id);
      if (throwError(gotUser)) {
        const added = await addGameToUser(gotUser._id, gameId);
        return throwError(added);
      }
    }
  });

  it("gets user by username", async () => {
    const username = "miguel";
    // User created! Now retrieve
    const gotUser = await getUserByUsername(username);
    return throwError(gotUser);
  });
});

describe("User's routes", function() {
  it("/GET :: gets all users", done => {
    chai
      .request(server)
      .get("/users")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("/POST :: creates a new user", done => {
    const newUser = {
      username: "miguel",
      avatar: "another"
    };
    chai
      .request(server)
      .post("/users")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  it("/POST :: error creating a new user with no username", done => {
    const newUser = {
      avatar: "another"
    };
    chai
      .request(server)
      .post("/users")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        expect(res.body.errors).to.satisfy(function(errors) {
          return errors.length >= 0;
        });
        done();
      });
  });

  it("/POST :: error creating a new user with no avatar", done => {
    const newUser = {
      username: "miguel"
    };
    chai
      .request(server)
      .post("/users")
      .send(newUser)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        expect(res.body.errors).to.satisfy(function(errors) {
          return errors.length >= 0;
        });
        done();
      });
  });

  it("/POST :: error creating a new user with no nothing", done => {
    chai
      .request(server)
      .post("/users")
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a("object");
        expect(res.body.errors).to.satisfy(function(errors) {
          return errors.length >= 0;
        });
        done();
      });
  });

});
