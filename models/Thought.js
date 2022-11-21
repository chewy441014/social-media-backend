const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {type: Schema.Types.ObjectId, default: new Schema.Types.ObjectId() },
        reactionBody: { type: String, required: true, minLength: 1, maxLength: 280 },
        username: { type: String, required: true },
        createdAt: { type: Date, default: new Date }
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

reactionSchema.virtual('createdAt').get(() => {
    return `${this.createdAt.toDateString}`
})

const thoughtSchema = new Schema(
    {
        thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
        createdAt: { type: Date, default: new Date },
        username: { type: String, required: true },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
        }
    }
);

thoughtSchema.virtual('createdAt').get(() => {
    return `${this.createdAt.toDateString}`
})

// Create a virtual property `reactionCount` that gets the thoughts number of reactions
thoughtSchema.virtual('reactionCount')
    .get(function () {
        if (this.reactions) {
            return this.reactions.length;
        }
    });

// Initialize our Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
