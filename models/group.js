const mongoose = require('mongoose');
const {ObjectId}= mongoose.Schema.Types
const GroupSchema = new mongoose.Schema({
    group_name:{
        type:String,
        required:true
    },
    user_ids: [{type:ObjectId, ref:"User"}],
    message_ids: [{type:ObjectId,ref:"Message"}],
    is_active: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

mongoose.model("Group", GroupSchema);
