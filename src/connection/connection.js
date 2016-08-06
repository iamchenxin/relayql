/** @flow
 *
 * The GraphQL connections type
 */

import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLString,
  GraphQLScalarType
} from 'flow-graphql';

import type {
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldResolveFn,
  GraphQLResolveInfo
} from 'flow-graphql';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
} from '../def/common.js';
import {
  resolveThunk
} from '../def/common.js';

import type {
  NodeJS,
  ConnectionCursorJS,
  EdgeJS,
  PageInfoJS,
  ConnectionJS,
  ForwardArgsJS,
  BackwardArgsJS,
  ConnectionArgsJS,
  ArrayRange
} from '../def/datastructure.js';

import {
  pro
} from 'flow-dynamic';
const {
  argsCheck,
  isString,
  isNumber,
  undefable,
  nullable
} = pro;
/**
 * The common page info type used by all connections.
 */
const pageInfoType = new GraphQLObjectType({
  name: 'PageInfo',
  description: 'Information about pagination in a connection.',
  fields: () => ({
    hasNextPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'When paginating forwards, are there more items?'
    },
    hasPreviousPage: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'When paginating backwards, are there more items?'
    },
    startCursor: {
      type: GraphQLString,
      description: 'When paginating backwards, the cursor to continue.'
    },
    endCursor: {
      type: GraphQLString,
      description: 'When paginating forwards, the cursor to continue.'
    },
  })
});


function releyQLConnectionMaker(edgeType: GraphQLObjectType,
_name?: string): GraphQLObjectType {
  const name = _name? _name: getEdgeTypeName(edgeType);
  return new GraphQLObjectType({
    name: name + 'Connection',
    description: 'A connection to a list of items.',
    fields: () => ({
      pageInfo: {
        type: new GraphQLNonNull(pageInfoType),
        description: 'Information to aid in pagination.',
      },
      edges: {
        type: new GraphQLList(edgeType),
        description: 'A list of edges.',
      },
    }),
  });
}
function getEdgeTypeName(edgeType: GraphQLObjectType): string {
  if (edgeType.name.length <= 4){
    return edgeType.name;
  }
  if (edgeType.name.slice(-4) == 'Edge') {
    return edgeType.name.slice(0,-4);
  } else {
    return edgeType.name;
  }
}

// fieldise ......


/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with forward pagination.
 */
const forwardConnectionArgs: GraphQLFieldConfigArgumentMap = {
  after: {
    type: GraphQLString
  },
  first: {
    type: GraphQLInt
  },
};

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with backward pagination.
 */
const backwardConnectionArgs: GraphQLFieldConfigArgumentMap = {
  before: {
    type: GraphQLString
  },
  last: {
    type: GraphQLInt
  },
};

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with bidirectional pagination.
 */
const connectionArgs: GraphQLFieldConfigArgumentMap = {
  ...forwardConnectionArgs,
  ...backwardConnectionArgs,
};
type ConnectionArgsType = GraphQLFieldConfigArgumentMap;


type ConnectionResolveFn<TSource > = (source:TSource, args:ConnectionArgsJS,
  context: mixed, info:GraphQLResolveInfo) => ConnectionJS<*>;

type ConnectionFieldConfig<TSource> = {
  type: GraphQLObjectType;
  args: 'forward'|'backward'|'all';
  resolve: ConnectionResolveFn<TSource >;
  deprecationReason?: ?string;
  description?: ?string;
};
function relayQLConnectionFieldSpec<TSource>(config: ConnectionFieldConfig<TSource>)
:GraphQLFieldConfig<TSource> {
  let args: GraphQLFieldConfigArgumentMap = connectionArgs;
  if (config.args == 'forward') {
    args = forwardConnectionArgs;
  } else if (config.args == 'backward'){
    args = backwardConnectionArgs;
  }
  const undefableString = undefable(isString);
  const undefableInt = undefable(isNumber.isInt);
  const checkedFn = argsCheck(
    args => ({
      after: undefableString(args.after),
      first: undefableInt(args.first, 'args.frist must be int'),
      before: undefableString(args.before),
      last: undefableInt(args.last, 'args.last must be int')
    }),
    config.resolve
  );
  return {
    type: config.type,
    args: args,
    resolve: checkedFn,
    deprecationReason: config.deprecationReason,
    description: config.description,
  };
}

export {
  releyQLConnectionMaker,
  relayQLConnectionFieldSpec,
  forwardConnectionArgs,
  backwardConnectionArgs,
  connectionArgs
};

export type {
  ConnectionArgsType
};
