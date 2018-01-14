import schema from '../../models/schema';
import authModel from '../../middleware/auth';

module.exports = (app, includes) => {
  app.use('/graphql', authModel.requireLogin, includes.graphqlHTTP({
    schema: schema.graphqlSchema,
    graphiql: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  }));
};
