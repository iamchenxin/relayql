/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType,
  GraphQLString,
  GraphQLInt
} from 'flow-graphql';

/**
* An flow type alias for cursors in this implementation.
*/
type ConnectionCursor = string;

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with forward pagination.
 */
const forwardConnectionArgs = {
  after: {
    type: GraphQLString
  },
  first: {
    type: GraphQLInt
  },
};
type ResolvedForwardArgs = {
  after: ConnectionCursor,
  first: number
};

/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with backward pagination.
 */
const backwardConnectionArgs = {
  before: {
    type: GraphQLString
  },
  last: {
    type: GraphQLInt
  },
};
type ResolvedBackwardArgs = {
  before: ConnectionCursor,
  last: number
};
/**
 * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
 * whose return type is a connection type with bidirectional pagination.
 */
const connectionArgs = {
  ...forwardConnectionArgs,
  ...backwardConnectionArgs,
};

type ConnectionArgsType = typeof forwardConnectionArgs|
  typeof backwardConnectionArgs;
type ResolvedConnectionArgs = ResolvedForwardArgs|ResolvedBackwardArgs;

export {
  forwardConnectionArgs,
  backwardConnectionArgs
};

export type {
  ConnectionArgsType,
  ResolvedConnectionArgs,
  ConnectionCursor
};
