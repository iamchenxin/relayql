/** @flow
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
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
  GraphQLFieldResolveFn
} from 'flow-graphql';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  Thunk
} from '../def/common.js';
import {
  resolveThunk
} from '../def/common.js';

type RelayEdgeMakerConfig<TSource> = {
  node:{
    type: GraphQLInterfaceType,
    resolve?: GraphQLFieldResolveFn<TSource, *>,
//    description?: string //for flow check,do not need input
  },
  cursor: {
    resolve: GraphQLFieldResolveFn<TSource, *>,
//    type?:  GraphQLNonNull<GraphQLScalarType>, //FLOW-ARGS:do not need input
//    description?: string //FLOW-ARGS:do not need input
  },
  [key:string]:GraphQLFieldConfig<TSource>
};

/*
 * this design assume edge is a BlackBox, so should not customise by user.
 * there is no customise requirement for it.
 * so it have no resolver for its fields,

 * but default, the name is nodeType.name + 'Edge'
**/
function relayEdgeMaker(nodeType: GraphQLObjectType, _name?:string) {

  const name = _name? _name: nodeType.name;
  return new GraphQLObjectType({
    name: name + 'Edge',
    description: 'An edge in a connection.',
    fields: () => ({
      node:{
        type: nodeType,
        description: 'The item at the end of the edge',
      },
      cursor: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'A cursor for use in pagination'
      },
    }),
  });
}

export {
  relayEdgeMaker
};
