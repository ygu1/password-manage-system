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

const logSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: [true, 'user ID is required']
  },
  domain: {
    type: String,
    require: [true, 'domain is required']
  },
  username: {
    type: String,
    require: [true, 'username is required']
  },
  password: {
    type: String,
    require: [true, 'password is required']
  },
  note: {
    type: String,
    default: ''
  },
  lastUpdate: {
    type: Date,
    default: null
  }
});

const Log = mongoose.model('logs', logSchema);

const LogType = new GraphQLObjectType({
  name: 'LogType',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    domain: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    note: {
      type: GraphQLString
    },
    lastUpdate: {
      type: GraphQLString
    }
  })
});

const LogInputType = new GraphQLInputObjectType({
  name: 'LogInputType',
  fields: () => ({
    _id: {
      type: GraphQLID
    },
    userId: {
      type: GraphQLString
    },
    domain: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    note: {
      type: GraphQLString
    }
  })
});

module.exports.LogMongo = Log;

module.exports.LogType = LogType;

module.exports.logsQuerySchema = {
  type: new GraphQLList(LogType),
  args: {
    input: {
      type: LogInputType
    }
  },
  async resolve(root, params) {
    try {
      if (!_.isEmpty(params.input.userId)) {
        return await Log.find({ userId: params.input.userId });
      }
      return await Log.find({});
    } catch (e) {
      throw e;
    }
  }
};
