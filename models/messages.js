const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types
const MessageSchema = new mongoose.Schema({
    user_id: {type:ObjectId, ref:"User"},
    group_id: {type: ObjectId, ref: "Group"},
    content:{
        type:String
    },
}, {timestamps: true})

mongoose.model("Message", MessageSchema);
