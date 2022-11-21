const Thought = require('../models/Thought');

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
        const thoughtData = await User.findOne({ _id: req.params.thoughtId });
        if (thoughtData) {
            res.status(200).json(thoughtData);
        } else {
            res.status(404).json({ message: `no user id: ${req.params.thoughtId} found` })
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
                res.status(200)
            } else {
                res.status(400).json({ message: `cannot find user ${req.body.username} or issue with ${newThought._id}`, body: newThought })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// put update by id
// delete by id

// /api/thoughts/:thoughtId/reactions
// post create a reaction in thought's reaction array
// delete remove reaction by reactionid


module.exports = { getAllThoughts, getThoughtById, newThought }; // export what needs to be exported