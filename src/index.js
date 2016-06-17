/* @flow */
/**
 *
 */

import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLResolveInfo
} from 'flow-graphql';

type TypeResolverFn = (object: any) => ?GraphQLObjectType;

function RelayQLNodeMaker(typeResolver:TypeResolverFn):GraphQLInterfaceType {
  return new GraphQLInterfaceType({
    name: 'Node',
    description: 'An object with an ID',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The id of the object.',
      },
    }),
    resolveType: typeResolver
  });
}
