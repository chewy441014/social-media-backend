const User = require('../models/User');
const { ObjectId } = require('mongoose').Types;

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
        const newUser = await User.create(req.body);
        if (!newUser) {
            res.status(404).json({ message: 'could not create new user', body: req.body })
        } else {
            res.status(200).json(newUser)
        }
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
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true });
        if (!updatedUser) {
            res.status(404).json({ message: `could not edit user ${req.params.userId}`, body: req.body })
        } else {
            res.status(200).json(updatedUser)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

// delete a user by id
// /api/users/delete/:userId
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findOneAndDelete({ _id: req.params.userId })
        if (!deleted) {
            res.status(404).json({ message: `could not delete user ${req.params.userId}` })
        } else {
            console.log('user deleted')
            res.status(200).json(deleted);
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// post add new friend to friends list
// /api/users/:userId/friends/:friendId
const addFriend = async (req, res) => {
    try {
        console.log(`adding a friend to your friends list ${req.params.userId}, friend id ${req.params.friendId}`)
        const friendlyUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: ObjectId(req.params.friendId) } }, { new: true });
        const friendlyFriend = await User.findOneAndUpdate({ _id: req.params.friendId }, { $addToSet: { friends: ObjectId(req.params.userId) } }, { new: true });
        if (!friendlyUser || !friendlyFriend) {
            res.status(404).json({ message: `could not find user ${req.params.userId}, but friend exists, or something went wrong` })
        } else {
            console.log('friend added')
            res.status(200).json({ user: friendlyUser, friend: friendlyFriend })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

// delete remove a friend from friends list
// /api/users/:userId/friends/:friendId
const deleteFriend = async (req, res) => {
    try {
        console.log(`removing a friend from your friends list ${req.params.userId}, friend id ${req.params.friendId}`)
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.userId }, { $pullAll: { friends: [ ObjectId(req.params.friendId) ] } }, { new: true });
        const updatedFriend = await User.findOneAndUpdate({ _id: req.params.friendId }, { $pullAll: { friends: [ ObjectId(req.params.userId) ] } }, { new: true });
        if (!updatedUser || !updatedFriend) {
            res.status(404).json({ message: `could not find user ${req.params.userId}, or friend doesn't exist, or maybe they're not friends` })
        } else {
            res.status(200).json({user: updatedUser, exFriend: updatedFriend});
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriend }; // export what needs to be exported