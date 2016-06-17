/* @flow */
/**
 *
 */

import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType,
  GraphQLEnumType
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLResolveInfo
} from 'flow-graphql';

type NonNullRelayType = GraphQLNonNull<
    GraphQLScalarType |
    GraphQLEnumType  >;

type TypeResolverFn = (object: any) => ?GraphQLObjectType;
type ResolverFn = (source:Object, args:Object, context: mixed, info:Object)
 => mixed;
type RelayType = GraphQLInterfaceType|GraphQLObjectType;

type RelayField<RELAYTYPE> = {
  name: string,
  description: string,
  type: RELAYTYPE,
  args?: {[key:string]:Object},
  resolve:ResolverFn
};


export type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  RelayType
};
