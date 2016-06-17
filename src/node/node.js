/* @flow */
/**
 *
 */

import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  GraphQLResolveInfo
} from 'flow-graphql';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  RelayType
} from '../type/definition.js';

import {
  regDefaultField
} from '../utils/fieldmaker.js';

import {
  base64,
  unbase64
} from '../utils/base64.js';

// Make a Relay's Node Interface
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

// This is the default field set when a field's type is Node
regDefaultField(
  'Node',
  (nodeType:RelayType, resolver:ResolverFn) => ({
    name: 'node',
    description: 'Fetches an object given its ID',
    type: nodeType,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of an object'
      }
    },
    resolve: resolver
  })
);


export type ResolvedGlobalId = {
  type: string,
  id: string
}

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */
export function toGlobalId(type: string, id: string): string {
  return base64([type, id].join(':'));
}

/**
 * Takes the "global ID" created by toGlobalID, and returns the type name and ID
 * used to create it.
 */
export function fromGlobalId(globalId: string): ResolvedGlobalId {
  var unbasedGlobalId = unbase64(globalId);
  var delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1)
  };
}

/**
 * Creates the configuration for an id field on a node, using `toGlobalId` to
 * construct the ID from the provided typename. The type-specific ID is fetched
 * by calling idFetcher on the object, or if not provided, by accessing the `id`
 * property on the object.
 */
export function globalIdField(
  nameOrResolver?: string|ResolverFn
):RelayField< GraphQLNonNull<GraphQLScalarType> > {
  let defaultResolver:ResolverFn;
  // in javascript typeof null === 'object',so ...
  if (nameOrResolver === null) {
    nameOrResolver = undefined;
  }
  switch (typeof nameOrResolver) {
  case 'string':
    const typeName:string = nameOrResolver;
    defaultResolver = (source ) => toGlobalId(typeName, source.id);
    break;
  case 'undefined':
    defaultResolver = (source, ag, ctx, info) =>
      toGlobalId(info.parentType.name, source.id);
    break;
  case 'function':
    defaultResolver = nameOrResolver;
    break;
  default:
    //should not reach here
    throw new Error('globalIdField() only accept string|ResolverFn' +
    `but you passed a ${nameOrResolver}`);
  }

  return {
    name: 'id',
    description: 'The ID of an object',
    type: new GraphQLNonNull(GraphQLID),
    resolve: defaultResolver
  };
}
