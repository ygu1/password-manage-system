import userModel from '../../models/users';

module.exports = (app, includes) => {
  app.use('/graphql', includes.graphqlHTTP({
    schema: userModel.userGraphqlSchema,
    graphiql: 'development',
  }));
};
