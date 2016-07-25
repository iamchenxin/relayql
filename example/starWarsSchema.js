/* @flow
 *
**/

import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} from 'flow-graphql';

import type {
  GraphQLResolveInfo,
  GraphQLFieldConfig,
  GraphQLIsTypeOfFn
} from 'flow-graphql';

import {
  getFaction,
  getShip,
  getRebels,
  getEmpire,
  createShip,
} from './starWarsData.js';

import type {
  ShipDT,
  FactionDT
} from './starWarsData.js';

import {
  encodeId,
  decodeId,
  relayQLIdField,
  relayQLNodeMaker,
  relayQLNodableType,
  relayQLNodeField
} from '../src/node/index.js';

import {
  relayEdgeMaker,
  releyQLConnectionMaker,
  relayQLConnectionField
} from '../src/connection/index.js';

import type {
  NodeJS,
  ConnectionCursorJS,
  EdgeJS,
  PageInfoJS,
  ConnectionJS,
  ConnectionArgsJS,
} from '../src/def/datastructure.js';



/**
 * This is a basic end-to-end test, designed to demonstrate the various
 * capabilities of a Relay-compliant GraphQL server.
 *
 * It is recommended that readers of this test be familiar with
 * the end-to-end test in GraphQL.js first, as this test skips
 * over the basics covered there in favor of illustrating the
 * key aspects of the Relay spec that this test is designed to illustrate.
 *
 * We will create a GraphQL schema that describes the major
 * factions and ships in the original Star Wars trilogy.
 *
 * NOTE: This may contain spoilers for the original Star
 * Wars trilogy.
 */

/**
 * Using our shorthand to describe type systems, the type system for our
 * example will be the followng:
 *
 * interface Node {
 *   id: ID!
 * }
 *
 * type Faction : Node {
 *   id: ID!
 *   name: String
 *   ships: ShipConnection
 * }
 *
 * type Ship : Node {
 *   id: ID!
 *   name: String
 * }
 *
 * type ShipConnection {
 *   edges: [ShipEdge]
 *   pageInfo: PageInfo!
 * }
 *
 * type ShipEdge {
 *   cursor: String!
 *   node: Ship
 * }
 *
 * type PageInfo {
 *   hasNextPage: Boolean!
 *   hasPreviousPage: Boolean!
 *   startCursor: String
 *   endCursor: String
 * }
 *
 * type Query {
 *   rebels: Faction
 *   empire: Faction
 *   node(id: ID!): Node
 * }
 *
 * input IntroduceShipInput {
 *   clientMutationId: string!
 *   shipName: string!
 *   factionId: ID!
 * }
 *
 * input IntroduceShipPayload {
 *   clientMutationId: string!
 *   ship: Ship
 *   faction: Faction
 * }
 *
 * type Mutation {
 *   introduceShip(input IntroduceShipInput!): IntroduceShipPayload
 * }
 */

const nodeInterface = relayQLNodeMaker( ({_resolvedId}) => {
  switch (_resolvedId.type) {
    case 'Faction':
    return factionType;
    case 'Ship':
    return shipType;
    default:
    return shipType;
  }
} );

const shipType = relayQLNodableType({
  name: 'Ship',
  description: 'A ship in the Star Wars saga',
  fields: () => ({
    id: relayQLIdField(),
    name: {
     type: GraphQLString,
     description: 'The name of the ship.',
    },
  }),
  interfaces: [nodeInterface]
});

var factionType = relayQLNodableType({
  name: 'Faction',
  description: 'A faction in the Star Wars saga',
  fields: () => ({
    id: relayQLIdField(),
    name: {
      type: GraphQLString,
      description: 'The name of the faction.',
    },
    ships: relayQLConnectionField({
      type: shipConnection,
      description: 'The ships used by the faction.',
      args: 'all',
      resolve: (faction, args) => {
        return {
          pageInfo:{
            startCursor: null,
            endCursor: null,
            hasPreviousPage: false,
            hasNextPage: false
          },
          edges:[{
            node:{
              id: 'test'
            },
            cursor: 'fortest',
          }]
        };
      },
    }),
  }),
  interfaces: [nodeInterface]
});

const shipEdge = relayEdgeMaker(shipType);
const shipConnection = releyQLConnectionMaker(shipEdge);
