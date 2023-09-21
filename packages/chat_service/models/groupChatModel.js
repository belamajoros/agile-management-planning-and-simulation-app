const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupChatSchema = new Schema({
    messages: [
        {
            senderId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            username: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            content: {
                type: String,
                required: true
            }
        }
    ],
    created_at: Date,
    updated_at: Date
});

const GroupChat = mongoose.model('GroupChat', GroupChatSchema);

module.exports = GroupChat;