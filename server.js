const {dotenv} = require('dotenv');
const { GraphQLServer, PubSub } = require('graphql-yoga');
const mongoose= require('mongoose');
const cors = require('cors');
const { get } = require('lodash');

const { mongoURI } = require('./config');
const typeDefs = require('./schema/typeDef');
const resolvers = require('./resolvers/resolver');

// require('dotenv').config({path:'graphql-server/.env'});

//mongodb connnection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
})
mongoose.connection.on('error', (err) => {
    console.log('error in connection to mongodb',err);
})


//setting up server
const pubsub = new PubSub();

const server = new GraphQLServer({typeDefs, resolvers, context: req => {
    return {...req, pubsub};
}});
server.start((port) => {
    console.log('server is running on port 🤘', port);
})

