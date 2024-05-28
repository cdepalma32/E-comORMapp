const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    try {
      let token;
  
      // Check if token is in query parameters
      if (req.query && req.query.token) {
        token = req.query.token;
      } else if (req.headers.authorization) {
        // Check if token is in authorization header
        const authHeader = req.headers.authorization;
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
          token = tokenParts[1];
        }
      }
  
      // Check if token is present
      if (!token) {
        console.error('No token found in request');
        // If no token is found, simply call next() without sending a response
        return next();
      }
  
      // verify token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
  
      // send to next endpoint
      next();
    } catch (error) {
      console.error('Error in authentication middleware:', error);
      // If there's an error, call next() without sending a response
      return next();
    }
  },
  
  signToken: function ({ username, email, _id }) {
    try {
      const payload = { username, email, _id };
      const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
      console.log('Token signed successfully:', token);
      return token;
    } catch (error) {
      console.error('Error in token signing:', error);
      throw new Error('Token signing failed');
    }
  },
};
