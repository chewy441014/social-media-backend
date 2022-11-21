const User = require('../models/User');

// setup functions for user api

// /api/users

// get all users
// /api/users/
const getUsers = async (req, res) => {
    try {
        const userData = await User.find();
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err)
    }
}

// get a single user by id
// /api/users/:userId
const getUserById = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.params.userId });
        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: `no user id: ${req.params.userId} found` })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

// post a new user
// /api/users/create/
/*
req.body = {
    username: ExampleUserName
    email: myUnique@Email.com
}
*/
const createUser = async (req, res) => {
    try {
        console.log(req.body);
        await User.create(req.body, function (err) {
            if (err) {
                res.status(404).json({ message: 'could not create new user', body: req.body })
            } else {
                console.log('user created')
                res.status(200)
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

// put a user by id
// /api/users/update/:userId
/*
req.body = {
    username: NewUserName
    email: myNewUnique@Email.com
}
*/
const updateUser = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true }, function (err) {
            if (err) {
                res.status(404).json({ message: `could not edit user ${req.params.userId}`, body: req.body })
            } else {
                console.log('user updated')
                res.status(200)
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

// delete a user by id
// /api/users/delete/:userId
const deleteUser = async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params.userId }, function (err) {
            if (err) {
                res.status(404).json({ message: `could not delete user ${req.params.userId}` })
            } else {
                console.log('user deleted')
                res.status(200)
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

// remove a user's thoughts when deleted BONUS

// post add new friend to friends list
// /api/users/:userId/friends/:friendId
const addFriend = async (req, res) => {
    try {
        console.log(`adding a friend to your friends list ${req.params.userId}, friend id ${req.params.friendId}`)
        const friendExists = await User.findOne({ _id: req.params.friendId });
        if (friendExists) {
            await User.findOneAndUpdate({ _id: req.params.userId }, { $push: { friends: req.params.friendId } }, function (err) {
                if (err) {
                    res.status(404).json({ message: `could not find user ${req.params.userId}, but friend exists, or something went wrong` })
                } else {
                    console.log('friend added')
                    res.status(200)
                }
            });
        } else {
            res.status(404).json({ message: `could not find friend ${req.params.friendId}` })
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// delete remove a friend from friends list
// /api/users/:userId/friends/:friendId
const deleteFriend = async (req, res) => {
    try {
        console.log(`removing a friend from your friends list ${req.params.userId}, friend id ${req.params.friendId}`)
        const friendExists = await User.findOne({ _id: req.params.friendId });
        // add check to see if friend is in user's friend list? 
        if (friendExists) {
            const updatedUser = await User.updateOne({ _id: req.params.userId }, { $pullAll: { friends: [{ _id: req.params.friendId }] } }, {new: true}, function (err) {
                if (err) {
                    res.status(404).json({ message: `could not find user ${req.params.userId}, but friend exists, or maybe they're not friends` })
                } else {
                    res.status(200).json(updatedUser)
                }
            });
        } else {
            res.status(404).json({ message: `could not find friend ${req.params.friendId}` })
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriend }; // export what needs to be exported