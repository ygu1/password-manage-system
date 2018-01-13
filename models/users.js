import mongoose from 'mongoose';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLNonNull
} from 'graphql';
import GraphQLDate from 'graphql-date';
import _ from 'underscore';
import loggers from '../middleware/loggers';
import Logs from './logs';

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
    },
    logs: {
      type: new GraphQLList(Logs.LogType),
      args: {
        userId: {
          name: 'userId',
          type: GraphQLString
        }
      },
      async resolve(root) {
        try {
          if (!_.isEmpty(root.userId)) {
            loggers.get('model').verbose(`Get logs for user: ${root.userId}`);
            return await Logs.LogMongo.find({ userId: root.userId });
          }
          return [];
        } catch (e) {
          throw e;
        }
      }
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

module.exports.userQuerySchema = {
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
        loggers.get('model').verbose(`Get user: ${params.userId} info`);
        const user = await User.find({ userId: params.userId });
        return user;
      }
      if (!_.isEmpty(params.email)) {
        loggers.get('model').verbose(`Get user: ${params.email} info`);
        const user = await User.find({ email: params.email });
        return user;
      }
      loggers.get('model').verbose('Get all users info');
      const users = await User.find({});
      return users;
    } catch (e) {
      throw e;
    }
  }
};

module.exports.userCreateSchema = {
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
};

module.exports.userUpdateSchema = {
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
};

module.exports.userDeleteSchema = {
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
      await Logs.LogMongo.remove({ userId: params.input.userId });
      loggers.get('models').verbose(`Successfully deleted all logs for user: ${params.input.userId}`);
      return true;
    } catch (e) {
      throw e;
    }
  }
};
