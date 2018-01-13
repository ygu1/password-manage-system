import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import logs from './logs';
import users from './users';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    logs: logs.logQuerySchema,
    users: users.userQuerySchema
  })
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: users.userCreateSchema,
    updateUser: users.userUpdateSchema,
    deleteUser: users.userDeleteSchema,
    createLog: logs.logCreateSchema,
    updateLog: logs.logUpdateSchema,
    deleteLog: logs.logDeleteSchema,
  })
});

module.exports.graphqlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutations
});
