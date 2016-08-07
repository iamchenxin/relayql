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
  GraphQLString,
  GraphQLSchema,
  GraphQLEnumType
} from 'flow-graphql';

import type {
  GraphQLResolveInfo,
  GraphQLFieldConfig,
  GraphQLIsTypeOfFn,
  GraphQLType,
  GraphQLNullableType
} from 'flow-graphql';

import {
  getFaction,
  getShip,
  getRebels,
  getEmpire,
  createShip,
  getShipByName
} from './starWarsData.js';

import type {
  ShipDT,
  FactionDT
} from './starWarsData.js';

import {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  edge,
  connection,
  connectionField,
  idField,
  nodeInterface,
  nodeInterfaceField,
  nodableType,
  nonNullList,
  nonNullListnonNull,
  pluralIdentifyingRootField,
  mutation,
} from '../src/index.js';


import type {
  NodeJS,
  ConnectionCursorJS,
  EdgeJS,
  PageInfoJS,
  ConnectionJS,
  ConnectionArgsJS,
} from '../src/index.js';


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

const nodeItf = nodeInterface.maker( ({_nodeInfo}) => {
  switch (_nodeInfo.type) {
    case 'Faction':
    return factionType;
    case 'Ship':
    return shipType;
    default:
    return shipType;
  }
} );

const shipType = nodableType.spec({
  name: 'Ship',
  description: 'A ship in the Star Wars saga',
  fields: () => ({
    id: idField.maker(),
    name: {
     type: GraphQLString,
     description: 'The name of the ship.',
    },
  }),
  interfaces: [nodeItf]
});

const shipEdge = edge.maker(shipType);
const shipConnection = connection.maker(shipEdge);

var factionType = nodableType.spec({
  name: 'Faction',
  description: 'A faction in the Star Wars saga',
  fields: () => ({
    id: idField.maker(),
    name: {
      type: GraphQLString,
      description: 'The name of the faction.',
    },
    ships: connectionField.spec({
      type: shipConnection,
      description: 'The ships used by the faction.',
      args: 'all',
      resolve: (source:FactionDT, args) => {
        const ships = source.ships.map(shipId => getShip(shipId));
        const range = decodeConnectionArgs(args,ships.length);
        const edges = edgesFromArray(ships, range);
        const pageInfo = pageInfoFromArray(edges, range, ships.length);
        return {
          pageInfo:pageInfo,
          edges:edges,
        };
      },
    }),
  }),
  interfaces: [nodeItf]
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    rebels: {
      type: factionType,
      resolve: () => getRebels(),
    },
    empire: {
      type: factionType,
      resolve: () => getEmpire(),
    },
    node: nodeInterfaceField.maker(nodeItf, (_nodeInfo) => {
      switch (_nodeInfo.type) {
        case 'Faction':
          return getFaction(_nodeInfo.serverId);
        case 'Ship':
        default:
          return getShip(_nodeInfo.serverId);
      }
    }),
    names: pluralIdentifyingRootField.spec({
      type: nonNullList(shipType), // Flow -> Array<?ShipDT>
      args: { // args is a {names: string[]} in Flow
        names:{
          type: nonNullListnonNull(GraphQLString)
        }
      },
      resolve: (_, args:{names: string[]}, cxt, info): Array<?ShipDT> => {
        const names = args.names;
        return names.map(name => getShipByName(name));
      }
    })
  })
});

const introduceShip = mutation.maker({
  name: 'IntroduceShip',
  inputFields: {
    shipName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    factionId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  payloadFields: {
    ship: {
      type: shipType,
      resolve: (payload) => getShip(payload.shipId)
    },
    faction: {
      type: factionType,
      resolve: (payload) => getFaction(payload.factionId)
    }
  },
  mutateAndGetPayload: ({shipName, factionId}) => {
    var newShip = createShip(shipName, factionId);
    return {
      shipId: newShip.id,
      factionId: factionId,
    };
  }
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    introduceShip: introduceShip
  })
});
/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const StarWarsSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
