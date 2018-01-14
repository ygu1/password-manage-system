import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';

const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  credentials: 'same-origin',
  cache: new InMemoryCache()
});

// client.networkInterface.use((request, next) => {
//   if (!request.session.user) {
//     request.session.user = uesr;
//   }
// });

const HomePage = require('./components/HomePage.jsx');

client.query({
  query: gql`
    query TodoApp {
      users {
        userId
      }
    }
  `,
})
  .then(data => console.log(data))
  .catch(error => console.error(error));

$(document).ready(() => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <HomePage />
    </ApolloProvider>, document.getElementById('react-content'),
  );
});
