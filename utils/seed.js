const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('Seeds DB connection established');
    // delete all table contents
    console.log('Deleting existing data....');
    await Thought.deleteMany({});
    await User.deleteMany({});

    // create new table contents in the format they expect
    /*
    const user = {
        username: string, required
        email: string, required
        thoughts: [], reference thoughtId, optional
        friends: [], reference friend userId, optional
    }
    */
    const users = [
        { username: 'preston1', email: 'preston@me.com' },
        { username: 'preston2', email: 'preston1@me.com' },
        { username: 'preston3', email: 'preston2@me.com' },
        { username: 'preston4', email: 'preston3@me.com' },
        { username: 'preston5', email: 'preston4@me.com' },
        { username: 'preston6', email: 'preston5@me.com' },
        { username: 'preston7', email: 'preston6@me.com' },
        { username: 'preston8', email: 'preston7@me.com' },
    ];

    /*
    const reaction = {
        reactionId: id, auto-created,
        reactionBody: string, required,
        username: string, required,
        createdAt: date, auto-created
    }
    */
    const reactions = [
        { reactionBody: 'Cool beans', username: 'preston8' },
        { reactionBody: 'Cool whip', username: 'preston7' },
        { reactionBody: 'Fava beans', username: 'preston6' },
        { reactionBody: 'Cool shoes bro', username: 'preston5' },
        { reactionBody: 'Cold noodles', username: 'preston4' },
        { reactionBody: 'Hot tofu', username: 'preston3' },
    ];

    /*
    const thought = {
        thoughtText: string, required,
        createdAt: date, auto-created,
        username: string, required
        reactions: [reactionSchema]
    }
    */
    const thoughts = [
        { thoughtText: 'Wow a novel idea', username: 'preston1', reactions: reactions.slice(0, 2) },
        { thoughtText: 'Wow a new novel idea', username: 'preston2' },
        { thoughtText: 'Wow a terrible idea', username: 'preston3' },
        { thoughtText: 'what a novel idea', username: 'preston4' },
        { thoughtText: 'look a novel', username: 'preston5' },
        { thoughtText: 'whoa no idea', username: 'preston6' },
        { thoughtText: 'Wow a strange idea', username: 'preston7' },
        { thoughtText: 'Wow a novel fruit', username: 'preston8', reactions: reactions.slice(2, 5) },
        { thoughtText: 'See a novel ocean', username: 'preston4' },
        { thoughtText: 'Dig a bigger mine', username: 'preston3' },
        { thoughtText: 'float a further boat', username: 'preston4' },
        { thoughtText: 'Beep boop', username: 'preston3', reactions: reactions.slice(5) },
    ];

    console.log('Starter data')
    console.table(users);
    console.table(reactions);
    console.table(thoughts);
    console.log(reactions.slice(0, 2));
    console.log(reactions.slice(2, 5));
    console.log(reactions.slice(5));

    // insert new users into the db
    console.log('Adding Users to DB');
    await User.collection.insertMany(users);

    // for each thought in the local array, insert new thought into the database, add the thoughtId to the thoughts array for the appropriate user
    console.log('Adding Thoughts with reactions to the DB');
    for (let i = 0; i < thoughts.length; i++) {
        console.log('--iterating--');
        let newThought = await Thought.create(thoughts[i]);
        await User.findOneAndUpdate({ username: thoughts[i].username }, { $push: { thoughts: newThought._id } });
    }
    console.log('Seeding complete')
    process.exit(0);
})