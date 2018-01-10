import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql';

import logs from './logs';
import users from './users';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    logs: logs.logsQuerySchema,
    users: users.usersQuerySchema
  })
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: users.usersCreateSchema,
    updateUser: users.usersUpdateSchema,
    deleteUser: users.usersDeleteSchema
  })
});

module.exports.graphqlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutations
});
