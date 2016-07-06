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

type NonNullRelayType = GraphQLNonNull<GraphQLScalarType|GraphQLEnumType>;

type TypeResolverFn = (source: {id: string}) => ?GraphQLObjectType;
type ResolverFn = (source:Object, args:Object, context: mixed, info:GraphQLResolveInfo)
 => mixed;
type CusTomType = GraphQLInterfaceType|GraphQLObjectType;

type RelayField<TYPE> = {
  name: string,
  description: string,
  type: TYPE,
  args?: {[key:string]:Object},
  resolve:ResolverFn
};


export type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  CusTomType,
  NonNullRelayType,
  GraphQLResolveInfo
};
