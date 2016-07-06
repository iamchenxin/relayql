/** @flow
 *
 * global id
 * functions for globalId
**/

import {
  base64,
  unbase64
} from '../utils/base64.js';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  GraphQLResolveInfo
} from '../def/common.js';

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType
} from 'flow-graphql';

import {
  pro
} from 'flow-dynamic';
const {sourceCheck, isString} = pro;

import {RelayQLError, eFormat} from '../utils/error.js';


type ResolvedGID = {
  type: string,
  id: string
};

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */
function encodeId(type: string, id: string): string {
  return base64([type, id].join(':'));
}

/**
 * Takes the "global ID" created by encodeId, and returns the type name and ID
 * used to create it.
 */
function decodeId(globalId: string): ResolvedGID {
  var unbasedGlobalId = unbase64(globalId);
  var delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1)
  };
}

type GIDEncodeFn = (source:{id:string}, args:mixed,
  context: mixed, info:GraphQLResolveInfo) => mixed;
/**
 * Creates the configuration for an id field on a node-extend type.
 * Basicly it maps a server data (typeName,id) => globalId (client data)
 * Like: encodeId(typeName, source.id)
 * always assume ,the upstream pass a source: {id: string} in.
 * using `encodeId` to construct the ID from the provided typename.
 * The type-specific ID is fetched
 * by calling idFetcher on the object, or if not provided, by accessing the `id`
 * property on the object.
 */
function RelayQLIdField(
  typenameOrResolver?: string|GIDEncodeFn
):RelayField< GraphQLNonNull<GraphQLScalarType> > {
  let defaultResolver:GIDEncodeFn;
  // in javascript typeof null === 'object',so ...
  if (typenameOrResolver === null) {
    typenameOrResolver = undefined;
  }
  switch (typeof typenameOrResolver) {
  case 'undefined': // by default use the name of field's owner.
    defaultResolver = (source, args, ctx, info) =>
      encodeId(info.parentType.name, source.id);
    break;
  case 'string': // if give a typename,use it as name.
    const typeName:string = typenameOrResolver;
    defaultResolver = (source ) => encodeId(typeName, source.id);
    break;
  case 'function': // or you can use your encode function
    defaultResolver = typenameOrResolver;
    break;
  default:
    //should not reach here
    throw new RelayQLError('globalIdField() only accept string|ResolverFn' +
    `but you passed a ${eFormat(typenameOrResolver)}`);
  }

  return {
  name: 'id',
  description: 'The ID of an object',
  type: new GraphQLNonNull(GraphQLID),
  resolve: sourceCheck(
    src => ({ id: isString(src.id) }),
    defaultResolver
  )
};
}

export type {
  ResolvedGID,
  GIDEncodeFn
};

export {
  encodeId,
  decodeId,
  RelayQLIdField
};
