const mongoose = require("mongoose");

require("../models/user");
require("../models/group");
require("../models/messages");

const User = mongoose.model("User");
const Group = mongoose.model("Group");
const Message = mongoose.model("Message");

const getUserDetails = async (user_id) => {
    const UserDetails = await User.findById(user_id);
    return UserDetails;
} 

const getGroupDetails = async (group_id) => {
    const GroupDetails = await Group.findById(group_id);
    return GroupDetails;
} 

const getMessageDetails = async(message_id) => {
    const messageDetails = await Message.findById(message_id);
    return messageDetails;
}

module.exports = {getUserDetails, getGroupDetails, getMessageDetails};
