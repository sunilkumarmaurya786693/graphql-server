const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types
const userSchema = new mongoose.Schema({
   
    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user_type: {
        type: String
    },
    group_ids: [{type:ObjectId,ref:"Group"}],
    message_ids: [{type:ObjectId,ref:"Message"}]
}, {timestamps: true})

mongoose.model("User",userSchema);

//mongoose will search User, Users, user, users collection.
