import schema from '../../models/schema';

module.exports = (app, includes) => {
  app.use('/graphql', includes.graphqlHTTP({
    schema: schema.graphqlSchema,
    graphiql: 'development',
  }));
};
