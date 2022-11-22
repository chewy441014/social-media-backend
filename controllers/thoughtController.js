const Thought = require('../models/Thought');
const User = require('../models/User');
const { ObjectId } = require('mongoose').Types;

// setup functions for user api

// get all thoughts
// /api/thoughts
const getAllThoughts = async (req, res) => {
    try {
        const thoughtData = await Thought.find();
        res.status(200).json(thoughtData)
    } catch (err) {
        res.status(500).json(err)
    }
}

// get a single thought by id
// /api/thoughts/:thoughtId
const getThoughtById = async (req, res) => {
    try {
        const thoughtData = await Thought.findOne({ _id: req.params.thoughtId });
        if (thoughtData) {
            res.status(200).json(thoughtData);
        } else {
            res.status(404).json({ message: `no thought id: ${req.params.thoughtId} found` })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

// post create new thought - add thought to user's thought array
// /api/thoughts/new
/*
req.body = {
    thoughtText: "The example thought text"
    username: "billyBob"
}
*/
const newThought = async (req, res) => {
    try {
        console.log(req.body);
        const newThought = await Thought.create(req.body);
        if (!newThought) {
            res.status(400).json({ message: 'could not create new thought', body: req.body })
        } else {
            console.log('thought created, add it to the user')
            const updatedUser = await User.findOneAndUpdate({ username: req.body.username }, { $push: { thoughts: newThought._id } });
            if (updatedUser) {
                console.log('updated user thoughts array with new thought id')
                res.status(200).json(updatedUser)
            } else {
                res.status(400).json({ message: `cannot find user ${req.body.username} or issue with ${newThought._id}`, body: newThought })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// put update by id
// /api/thoughts/update/:thoughtId
/*
req.body = {
    thoughtText: "The example thought text"
    username: "billyBob"
}
*/
const updateThought = async (req, res) => {
    try {
        console.log(req.body);
        const updatedThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
        if (!updatedThought) {
            res.status(400).json({ message: 'could not update thought', body: req.body })
        } else {
            console.log('thought updated')
            res.status(200).json(updatedThought);
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// delete by id
// /api/thoughts/delete/:thoughtId
const deleteThought = async (req, res) => {
    try {
        console.log(`deleting thought with id ${req.params.thoughtId}`)
        const updatedThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!updatedThought) {
            res.status(404).json({ message: `could not delete thought ${req.params.thoughtId}` })
        } else {
            console.log('thought deleted')
            res.status(200).json(updatedThought);
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// post a reaction in thought's reaction array
// /api/thoughts/:thoughtId/reactions
/*
req.body = {
    reactionBody: "The example reaction text"
    username: "billyBob"
}
*/
const createReaction = async (req, res) => {
    try {
        console.log(`creating reaction with thought id ${req.params.thoughtId}`)
        const updatedThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $push: { reactions: req.body } }, { new: true });
        if (!updatedThought) {
            res.status(404).json({ message: `could not create reaction for thought ${req.params.thoughtId}`, body: req.body })
        } else {
            console.log('reaction created and added to thought')
            res.status(200).json(updatedThought)
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// delete reaction by reactionId
// /api/thoughts/:thoughtId/reactions/:reactionId
const deleteReaction = async (req, res) => {
    try {
        console.log(`deleting reaction with reaction id ${req.params.reactionId}`)
        const updatedThought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: ObjectId(req.params.reactionId) } } }, { new: true });
        if (!updatedThought) {
            res.status(404).json({ message: `could not delete reaction for thought ${req.params.thoughtId}`, body: req.body })
        } else {
            console.log('reaction deleted')
            res.status(200).json(updatedThought)
        }
    } catch (err) {
        res.status(500).json(err);
    }
}


module.exports = { getAllThoughts, getThoughtById, newThought, updateThought, deleteThought, createReaction, deleteReaction }; // export what needs to be exported