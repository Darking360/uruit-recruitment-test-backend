const { UserModel: User } = './model';

export async function createUser(username) {
    try {
        const newUser = await User.create({ username });
        return newUser;
    } catch (error) {
        console.error('Error got from Mongo - creation :: ', error);
        return error;
    }
}

export async function getUser(_id) {
    try {
        const user = await User.findOne({ _id });
        return user;
    } catch (error) {
        console.error('Error got from Mongo - get single :: ', error);
        return error;
    }
}

export async function getUsers(params = {}) {
    try {
        const users = await User.find({ ...params });
        return users;
    } catch (error) {
        console.error('Error got from Mongo - get multiple :: ', error);
        return error;
    }
}

export async function deleteUser(_id) {
    try {
        await User.deleteMany({ _id })
        return true;
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return error;
    }
}

export async function updateUser(_id, updateData = {}) {
    try {
        const user = await User.findOne({ _id });
        Object.keys(updateData).forEach((key) => {
            user[key] = updateData[key];
        });
        await user.save();
        return user;
    } catch (error) {
        console.error('Error got from Mongo - delete :: ', error);
        return error;
    }
}