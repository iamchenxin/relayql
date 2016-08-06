/* @flow */

import express from 'express';
import graphQLHTTP from 't-express-graphql';
import path from 'path';
import {StarWarsSchema} from './starWarsSchema.js';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint

const graphQLServer = express();
const ghttp = graphQLHTTP({schema:StarWarsSchema, graphiql: true});
//console.log(StarWarsSchema);
graphQLServer.use('/', ghttp);
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

/*
query{
  rebels{
    id
    name
    ships(after: "",first: 6) {
      pageInfo{
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges{
        cursor
        node{
          name
        }
      }
    }
  }
}

mutation($in: IntroduceShipInput!){
  introduceShip(input: $in){
    ship{
      id
      name
    },
    faction{
      id
      name
      ships{
        edges{
          node{
            id
            name
          }
        }
      }
    }
  }
}

*/
