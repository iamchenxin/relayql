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
} from '../def/common.js';

import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType
} from 'graphql';

import type {
  GraphQLResolveInfo,
  GraphQLFieldConfig,
  GraphQLIsTypeOfFn
} from 'graphql';

import {
  pro,
  dev
} from 'flow-dynamic';
const {sourceCheck, isString} = pro;

import {RelayQLError, eFormat} from '../utils/error.js';


type NodeInfo = {
  type: string,
  serverId: string
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
function decodeId(globalId: string): NodeInfo {
  var unbasedGlobalId = unbase64(globalId);
  var delimiterPos = unbasedGlobalId.indexOf(':');
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    serverId: unbasedGlobalId.substring(delimiterPos + 1)
  };
}

type GIDEncodeFn = (source:{id:string}, args:{[argName: string]: mixed},
  context: mixed, info:GraphQLResolveInfo) => string;
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
function idFieldMaker(
  typenameOrResolver?: string|GIDEncodeFn
):GraphQLFieldConfig< *, * > {
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
  resolve: dev.sourceCheck(
    src => ({ id: isString(src.id) }),
    defaultResolver
  )
};
}

// export
const idField = {
  maker:idFieldMaker
};

export {
  encodeId,
  decodeId,
  idField,
};

// export type
export type {
  NodeInfo,
  GIDEncodeFn
};
