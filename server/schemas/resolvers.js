const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {

  Query: {
    me: async (parent, args, context) => {
      try {
        console.log('Query: me resolver called with context:', context);

        if (context.user) {
          const user = await User.findById(context.user._id).populate('savedBooks');
          console.log('User found:', user);
          return user;
        } else {
          throw new AuthenticationError('Not logged in');
        }
      } catch (error) {
        console.error('Error in me resolver:', error);
        throw error;
      }
    },
  },
  
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    createUser: async (parent, { username, email, password }) => {
      try {
        console.log(`Attempting to create user with email: ${email}`);
        const user = await User.create({ username, email, password });
        console.log('User created:', user);
        
        const token = signToken(user);
        console.log('Token created:', token);
        
        return { token, user };
      } catch (error) {
        console.error('Error in createUser resolver:', error);
        throw new Error('Failed to create user');
      }
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new AuthenticationError('Not logged in');
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

module.exports = resolvers;
