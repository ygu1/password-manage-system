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
      type: GraphQLDate
    }
  })
});

const LogQueryType = new GraphQLInputObjectType({
  name: 'LogQueryType',
  fields: () => ({
    userId: {
      type: GraphQLString
    },
  })
});

const LogCreateType = new GraphQLInputObjectType({
  name: 'LogCreateType',
  fields: () => ({
    userId: {
      type: new GraphQLNonNull(GraphQLString)
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

const LogUpdateType = new GraphQLInputObjectType({
  name: 'LogUpdateType',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID)
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

const LogDeleteType = new GraphQLInputObjectType({
  name: 'LogDeleteType',
  fields: () => ({
    _id: {
      type: GraphQLID
    },
    userId: {
      type: GraphQLString
    }
  })
});

module.exports.LogMongo = Log;

module.exports.LogType = LogType;

module.exports.logQuerySchema = {
  type: new GraphQLList(LogType),
  args: {
    input: {
      type: LogQueryType
    }
  },
  async resolve(root, params) {
    try {
      if (!_.isEmpty(params.input.userId)) {
        loggers.get('model').verbose(`Get user: ${params.input.userId} logs`);
        return await Log.find({ userId: params.input.userId });
      }
      loggers.get('model').verbose('Get all logs');
      return await Log.find({});
    } catch (e) {
      throw e;
    }
  }
};

module.exports.logCreateSchema = {
  type: LogType,
  args: {
    input: {
      type: LogCreateType
    }
  },
  async resolve(root, params) {
    try {
      const newLog = {
        userId: params.input.userId,
        domain: params.input.domain,
        username: params.input.username,
        password: params.input.password,
        note: params.input.note,
        lastUpdate: new Date()
      };
      const log = await new Log(newLog).save();
      loggers.get('model').verbose(`Successfully created log: ${log._id}`);
      return log;
    } catch (e) {
      throw e;
    }
  }
};

module.exports.logUpdateSchema = {
  type: LogType,
  args: {
    input: {
      type: LogUpdateType
    }
  },
  async resolve(root, params) {
    try {
      const log = await Log.findOneAndUpdate(
        { _id: params.input._id }, { $set: params.input }, { new: true }
      );
      loggers.get('model').verbose(`Successfully updated log: ${log._id}`);
      return log;
    } catch (e) {
      throw e;
    }
  }
};

module.exports.logDeleteSchema = {
  type: LogType,
  args: {
    input: {
      type: LogDeleteType
    }
  },
  async resolve(root, params) {
    try {
      if (!_.isEmpty(params.input._id)) {
        await Log.remove({ _id: params.input._id });
        loggers.get('model').verbose(`Successfully deleted log: ${params.input._id}`);
        return true;
      } else if (!_.isEmpty(params.input.userId)) {
        await Log.remove({ userId: params.input.userId });
        loggers.get('model').verbose(`Successfully deleted all logs for user: ${params.input.userId}`);
      }
      return false;
    } catch (e) {
      throw e;
    }
  }
};
