/* @flow */
/**
 *
 */

import {
  GraphQLInterfaceType,
} from 'flow-graphql';

import type {
  GraphQLObjectType,
} from 'flow-graphql';

import type {
  ResolverFn,
  RelayField,
  RelayType
} from '../type/definition.js';


type FieldMakeFn = (
  type:RelayType,
  resolver:ResolverFn
) => RelayField<RelayType>;

let typeToFieldStore:Map<string, FieldMakeFn> = new Map();


function regDefaultField(typeName:string, fieldMaker:FieldMakeFn):void {
  if ( typeToFieldStore.has(typeName) ) {
    throw new Error('duplicate defaultField,check the code');
  } else {
    typeToFieldStore.set(typeName, fieldMaker);
  }
}

function defaultField(
  relayType:RelayType,
  resolver:ResolverFn
):RelayField<RelayType> {
  const fieldMaker = typeToFieldStore.get(relayType.name);
  if ( fieldMaker ) {
    return fieldMaker(relayType, resolver);
  } else {
    throw new Error('The type passed in is not a Relay type');
  }
}

export {
  regDefaultField,
  defaultField
};
