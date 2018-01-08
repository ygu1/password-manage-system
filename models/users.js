import mongoose from 'mongoose';
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull
} from 'graphql';
import GraphQLDate from 'graphql-date';
import _ from 'underscore';
import loggers from '../middleware/loggers';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: [true, 'user ID is required']
  },
  familyName: {
    type: String,
    require: [true, 'user family name is required']
  },
  givenName: {
    type: String,
    require: [true, 'user given name is required']
  },
  email: {
    type: String,
    require: [true, 'user email is required']
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

const User = mongoose.model('users', userSchema);

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    familyName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    givenName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    lastLogin: {
      type: GraphQLDate
    }
  })
});

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInputType',
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    familyName: {
      type: GraphQLString
    },
    givenName: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    lastLogin: {
      type: GraphQLDate
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      args: {
        userId: {
          name: 'userId',
          type: GraphQLString
        },
        email: {
          name: 'email',
          type: GraphQLString
        }
      },
      async resolve(root, params) {
        try {
          if (!_.isEmpty(params.userId)) {
            const user = await User.find({ userId: params.userId });
            return user;
          }
          if (!_.isEmpty(params.email)) {
            const user = await User.find({ email: params.email });
            return user;
          }
          const users = await User.find({});
          return users;
        } catch (e) {
          throw e;
        }
      }
    }
  })
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: UserType,
      args: {
        input: {
          type: new GraphQLNonNull(UserInputType),
        },
      },
      async resolve(root, params) {
        try {
          const newUser = {
            userId: params.input.userId,
            familyName: params.input.familyName,
            givenName: params.input.givenName,
            email: params.input.email,
            lastLogin: new Date()
          };
          const user = await new User(newUser).save();
          loggers.get('models').verbose(`Successfully created user: ${params.input.userId}`);
          return user;
        } catch (e) {
          throw e;
        }
      }
    },
    updateUser: {
      type: UserType,
      args: {
        input: {
          type: new GraphQLNonNull(UserInputType),
        },
      },
      async resolve(root, params) {
        try {
          const user = await User.findOneAndUpdate(
            { userId: params.input.userId }, { $set: params.input }, { new: true }
          );
          loggers.get('models').verbose(`Successfully updated user: ${params.input.userId}`);
          return user;
        } catch (e) {
          throw e;
        }
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        input: {
          type: new GraphQLNonNull(UserInputType),
        },
      },
      async resolve(root, params) {
        try {
          await User.remove({ userId: params.input.userId });
          loggers.get('models').verbose(`Successfully deleted user: ${params.input.userId}`);
          return true;
        } catch (e) {
          throw e;
        }
      }
    }
  })
});

module.exports.userGraphqlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutations
});
