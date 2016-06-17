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
  GraphQLFieldConfig
} from 'flow-graphql';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  RelayType
} from '../type/definition.js';


type RelayEdgeFields = {
  node:{
    type: GraphQLInterfaceType,
    resolve: ResolverFn,
    description: string
  },
  cursor: {
    type:  GraphQLNonNull<GraphQLScalarType>,
    resolve: ResolverFn,
    description: string
  },
  [key:string]:GraphQLFieldConfig
};

type RelayEdgeMakerConfig = {
  node:{
    type: GraphQLInterfaceType,
    resolve: ResolverFn,
//    description?: string //for flow check,do not need input
  },
  cursor: {
    resolve: ResolverFn,
//    type?:  GraphQLNonNull<GraphQLScalarType>, //FLOW-ARGS:do not need input
//    description?: string //FLOW-ARGS:do not need input
  },
  [key:string]:GraphQLFieldConfig
};

type RelayQLEdgeType = {
  name: string,
  description: string,
  fields: () => RelayEdgeFields
};

function resolveMaybeThunk<T>(thingOrThunk: T | () => T): T {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}

function RelayEdgeMaker(name:string,
_customFields:RelayEdgeMakerConfig):GraphQLObjectType {
  // to use ... to allow passed fields outof (node,cursor)
  // this leads a strange flow behavious, customFields must be RelayEdgeMakerConfig
  const customFields =  { ...resolveMaybeThunk(_customFields) };
/*
  const outFields = {
    node : {
      type: customFields.node.type,
      resolve: customFields.node.resolve,
      description: 'The item at the end of the edge',
    },
    cursor : {
      type: new GraphQLNonNull(GraphQLString),
      resolve: customFields.cursor.resolve,
      description: 'A cursor for use in pagination'
    }
  };
  */

  customFields.node = {
    type: customFields.node.type,
    resolve: customFields.node.resolve,
    description: 'The item at the end of the edge',
  };
  customFields.cursor = {
    type: new GraphQLNonNull(GraphQLString),
    resolve: customFields.cursor.resolve,
    description: 'A cursor for use in pagination'
  };


  return new GraphQLObjectType({
    name: name + 'Edge',
    description: 'An edge in a connection.',
    fields: () => ({
      ...customFields
    }),
  });
}

/**
 * The common page info type used by all connections.
 */
var pageInfoType = new GraphQLObjectType({
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

type RelayConnectionMakerConfig = {
  edges: {
    type: GraphQLList<GraphQLObjectType>,
    description?: string //for flow check,do not need input
  },
  [key:string]:GraphQLFieldConfig
};

function ReleyConnectionMaker(name:string,
  _customFields:RelayConnectionMakerConfig):GraphQLObjectType {
  const customFields =  { ...resolveMaybeThunk(_customFields) };

  customFields.edges = {
    type: customFields.edges.type,
    description: 'A list of edges.'
  };

  return new GraphQLObjectType({
    name: name + 'Connection',
    description: 'A connection to a list of items.',
    fields: () => ({
      pageInfo: {
        type: new GraphQLNonNull(pageInfoType),
        description: 'Information to aid in pagination.'
      },
      ...customFields
    }),
  });
}
