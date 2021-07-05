const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs } = require("./apollo/type-defs")
const { resolvers } = require("./apollo/resolvers")
const { schema } = require("./apollo/schema")

// Initialize the app
const app = express();
//endpoint
app.use('/graphql', cors(), bodyParser.json(), graphqlExpress({ schema }));
//query playground
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
//start server
app.listen(5000, () => {
  console.log('Go to http://localhost:5000/graphiql to run queries!');
});