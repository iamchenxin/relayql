/* @flow */
/**
 * standerd way to make a connectiontypes field in relay
 */

import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType,
  GraphQLString,
  GraphQLInt,
  GraphQLTypeResolveFn
} from 'flow-graphql';

import type {
  GraphQLFieldConfigArgumentMap,
} from 'flow-graphql';

import {
  base64,
  unbase64,
} from '../utils/base64.js';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  RelayType
} from '../type/definition.js';

import {
  fromArray
} from './resolver.js';



import type {
  ConnectionArgsType,
  ResolvedConnectionArgs,
  ConnectionCursor
} from './type.js';

import {
  forwardConnectionArgs,
  backwardConnectionArgs
} from './type.js';

type ArraySliceMetaInfo = {
  sliceStart: number;
  arrayLength: number;
};


/**
 * A flow type designed to be exposed as `PageInfo` over GraphQL.
 */
type PageInfo = {
  startCursor: ?ConnectionCursor,
  endCursor: ?ConnectionCursor,
  hasPreviousPage: ?boolean,
  hasNextPage: ?boolean
}

/**
 * A flow type designed to be exposed as a `Connection` over GraphQL.
 */
type Connection<T> = {
  edges: Array<Edge<T>>;
  pageInfo: PageInfo;
}

/**
 * A flow type designed to be exposed as a `Edge` over GraphQL.
 */
type Edge<T> = {
  node: T;
  cursor: ConnectionCursor;
}


var PREFIX = 'arrayconnection:';

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset: number): ConnectionCursor {
  return base64(PREFIX + offset);
}

/**
 * Rederives the offset from the cursor string.
 */
export function cursorToOffset(cursor: ConnectionCursor): number {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

/**
 * Return the cursor associated with an object in an array.
 */
export function cursorForObjectInConnection<T>(
  data: Array<T>,
  object: T
): ?ConnectionCursor {
  var offset = data.indexOf(object);
  if (offset === -1) {
    return null;
  }
  return offsetToCursor(offset);
}

/**
 * Given an optional cursor and a default offset, returns the offset
 * to use; if the cursor contains a valid offset, that will be used,
 * otherwise it will be the default.
 */
export function getOffsetWithDefault(
  cursor?: ?ConnectionCursor,
  defaultOffset: number
): number {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  var offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}

type ConnectionField = {
  type: GraphQLObjectType,
  args: ConnectionArgsType,
  resolve: ResolverFn,
};
type ConnectionFields = {[connection:string]: ConnectionField};

function connectionField(
  type: GraphQLObjectType,
  resolverOrFieldName: ResolverFn|string,
  args?: ConnectionArgsType
):ConnectionField {
  let resolver;
  switch (typeof resolverOrFieldName) {
  case 'string':
    resolver = (source, args) => {
      const data = source[resolverOrFieldName];
      if (data == null) {
        throw new Error(`The field name [${resolverOrFieldName}] ` +
          'you passed in do not exist');
      }
      return fromArray(data, args);
    };
    break;
  case 'function':
    resolver = resolverOrFieldName;
    break;
  default:
    throw new Error(`resolverOrFieldName [${resolverOrFieldName}] ` +
      'you passed in is not ResolverFn|string');
  }

  return {
    type: type,
    args: args?args:connectionArgs,
    resolve: resolver
  };

  type DynamicCheckResolver = (source:any, args:{[key:string]:any},
      context:mixed, info:GraphQLResolveInfo) => mixed;
// dynamic Checker
  function resolverChecker(
    resolver:GraphQLTypeResolveFn,
    dataStructure:Object
  ):DynamicCheckResolver  {
    function dynamicResoler(source:any, args:{[key:string]:any},
      context:mixed, info:GraphQLResolveInfo):mixed {
      if()
    }
  }

  function checkedResolver(
    resolver:GraphQLTypeResolveFn,
    source:any, args:{[key:string]:any},
    context:mixed, info:GraphQLResolveInfo):mixed {
    try {
      const data = source[resolverOrFieldName];
      if(Array.isArray(data) )
    }
  }
}
