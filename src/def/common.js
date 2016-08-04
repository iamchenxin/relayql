/* @flow */
/**
 *
 */

import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLScalarType,
  GraphQLEnumType
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLType,
  GraphQLNullableType
} from 'flow-graphql';

type NonNullRelayType = GraphQLNonNull<GraphQLScalarType<*>|GraphQLEnumType>;

type TypeResolverFn = (source: {id: string}) => ?GraphQLObjectType;
type ResolverFn<TSource, TResult> = (
  source:TSource, args:{[argName: string]: mixed},
  context: mixed, info:GraphQLResolveInfo) => TResult;
type CusTomType = GraphQLInterfaceType|GraphQLObjectType;

type RelayField<TYPE> = {
  name: string,
  description: string,
  type: TYPE,
  args?: {[key:string]:Object},
  resolve:ResolverFn<*, *>
};

function list<T: GraphQLType>(v: T):GraphQLList<T> {
  return new GraphQLList(v);
}
function nonNull<T: GraphQLNullableType>(v: T):GraphQLNonNull<T> {
  return new GraphQLNonNull(v);
}

/**
 * Used while defining GraphQL types to allow for circular references in
 * otherwise immutable type definitions.
 */
export type Thunk<T> = (() => T) | T;

function resolveThunk<T>(thunk: Thunk<T>): T {
  return typeof thunk === 'function' ? thunk() : thunk;
}

/*
export type GraphQLObjectTypeConfig<TSource> = {
  name: string;
  interfaces?: Thunk<?Array<GraphQLInterfaceType>>;
  fields: Thunk<GraphQLFieldConfigMap<TSource>>;
  isTypeOf?: ?GraphQLIsTypeOfFn;
  description?: ?string
}
*/

export type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  CusTomType,
  NonNullRelayType,
  GraphQLResolveInfo
};

export {
  resolveThunk,
  list,
  nonNull
};
