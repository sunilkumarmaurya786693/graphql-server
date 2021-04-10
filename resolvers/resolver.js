const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectID } = require("mongodb");
const { get } = require("lodash");

const checkAuthentication = require("../checkAuth.js");
const { passwordEncrptionNumber, jWT_SECRET_KEY } = require("../config.js");
const {
  getUserDetails,
  getGroupDetails,
  getMessageDetails,
} = require("../Queries/Query");
require("../models/user");
require("../models/messages");
require("../models/group");

const User = mongoose.model("User");
const Message = mongoose.model("Message");
const Group = mongoose.model("Group");

const NEW_MESSAGE = "NEW_MESSAGE";

const resolvers = {
  Subscription: {
    get_new_message: {
      subscribe: async (_, __, { pubsub }) => pubsub.asyncIterator(NEW_MESSAGE),
    },
  },
  Query: {
    get_messages: async (_, __, context) => {
      if (!checkAuthentication(context)) return null;

      const all_message = await Message.find();
      return all_message;
    },

    get_groups: async (_, __, context) => {
      if (!checkAuthentication(context)) return null;
      const all_group = await Group.find();
      return all_group;
    },

    get_users: async (_, __, context) => {
      if (!checkAuthentication(context)) return null;
      const all_user = await User.find();
      return all_user;
    },

    login: async (_, { email, password }) => {
      const savedUser = await User.findOne({ email: email });
      if (!savedUser) return null;

      const isMatched = await bcrypt.compare(password, savedUser.password);
      if (isMatched) {
        const { _id, user_name, email } = savedUser;
        const token = jwt.sign({ _id, user_name, email }, jWT_SECRET_KEY);
        return token;
      }
      return null;
    },
  },
  Mutation: {
    create_group: async (_, { group_name }, context) => {
      const userData = checkAuthentication(context);
      if (!userData) return null;
      const { _id, user_name, email } = userData;
      const user_id = _id;
      const userDetails = await User.findById(user_id);
      if (userDetails.user_type === "admin") {
        const groupData = new Group({
          group_name,
          user_ids: [],
          message_ids: [],
          is_active: true,
        });
        await groupData.save();
        return true;
      }
      return false;
    },
    add_group_member: async (_, { group_id }, context) => {
      const userData = checkAuthentication(context);
      if (!userData) return null;
      const { _id, user_name, email } = userData;
      const user_id = _id;
      await Group.findByIdAndUpdate(group_id, {
        $addToSet: {
          user_ids: ObjectID(user_id),
        },
      });

      await User.findByIdAndUpdate(user_id, {
        $addToSet: {
          group_ids: ObjectID(group_id),
        },
      });
      return true;
    },
    add_message: async (_, { content, group_id }, context) => {
      const userData = checkAuthentication(context);
      if (!userData) return null;
      const { _id, user_name, email } = userData;
      const user_id = _id;

      const message = new Message({
        user_id: ObjectID(user_id),
        content: content,
        group_id: ObjectID(group_id),
      });
      const saveMessage = await message.save();
      
      if (saveMessage._id) {
        await User.findByIdAndUpdate(user_id, {
          $addToSet: {
            message_ids: ObjectID(saveMessage._id),
          },
        });
        await Group.findByIdAndUpdate(group_id, {
          $addToSet: {
            message_ids: ObjectID(saveMessage._id),
          },
        });

        const { pubsub } = context;
        pubsub.publish(NEW_MESSAGE, { get_new_message: saveMessage });
      }
      return true;
    },
    register: async (_, { user_name, email, password, user_type }) => {
      if (user_name && email && password) {
        const savedUser = await User.findOne({ email: email });
        if (savedUser) return null;
        const securedPassword = await bcrypt.hash(
          password,
          passwordEncrptionNumber
        );
        const user = new User({
          user_name,
          email,
          password: securedPassword,
          user_type,
          group_ids: [],
          message_ids: [],
        });
        await user.save();
        return user;
      } else {
        return res.status(422).json({ error: "please fill all the field" });
      }
    },
  },

  Message: {
    sender: async (message, _, context) => {
      const user_id = message.user_id;
      return getUserDetails(user_id);
    },
    group: async (message, _, context) => {
      const group_id = message.group_id;
      return getGroupDetails(group_id);
    },
  },
  User: {
    messages: async (userDetails, _, context) => {
      const message_ids = get(userDetails, "message_ids", []);
      const messages = await Promise.all(
        message_ids.map((message_id) => getMessageDetails(message_id))
      );
      return messages;
    },
    groups: async (userDetails, _, context) => {
      const group_ids = get(userDetails, "group_ids", []);
      const groups = await Promise.all(
        group_ids.map((group_id) => getGroupDetails(group_id))
      );
      return groups;
    },
  },
  Group: {
    members: async (group, _, context) => {
      const user_ids = get(group, "user_ids", []);
      const users_details = await Promise.all(
        user_ids.map((user_id) => getUserDetails(user_id))
      );
      return users_details;
    },
    messages: async (group, _, context) => {
      const message_ids = get(group, "message_ids", []);
      const messages = await Promise.all(
        message_ids.map((message_id) => getMessageDetails(message_id))
      );
      return messages;
    },
  },
};

module.exports = resolvers;
