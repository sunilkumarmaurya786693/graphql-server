const { get } = require('lodash');
const jwt = require('jsonwebtoken');

const { jWT_SECRET_KEY } = require('./config.js');
const checkAuthentication = (context) => {
    const token = get(context, 'request.headers.authorization', null);
    if(!token)return null;

    const isAuthenticate = jwt.verify(token,jWT_SECRET_KEY);

    if(!isAuthenticate || !isAuthenticate._id || !isAuthenticate.email) return null;
    return isAuthenticate;
}
module.exports = checkAuthentication;
