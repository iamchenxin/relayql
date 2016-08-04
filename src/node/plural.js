/** @flow
 *
 * Plural identifying root fields
 * https://facebook.github.io/relay/graphql/objectidentification.htm
**/

import {
  GraphQLList,
  GraphQLNonNull,
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLObjectType
} from 'flow-graphql';

import {
  list,
  nonNull
} from '../def/common.js';

type NonNullListNonNull<T> =
  GraphQLNonNull< GraphQLList< GraphQLNonNull<T> > >;
type PluralArgType =
  NonNullListNonNull<GraphQLScalarType> |
  NonNullListNonNull<GraphQLEnumType> |
  NonNullListNonNull<GraphQLInputObjectType>;

type PluralFieldArgumentConfig = {
  type: PluralArgType,
  defaultValue?: mixed,
  description?: ?string,
};

type PluralFieldArgumentMap = {
  [argName: string]: PluralFieldArgumentConfig,
};

/*
 * the spec said :
 * The return type of a plural identifying root field must be a list,
 * or a non‐null wrapper around a list.
 * but could use Throw Error,instead of return a null
 * so the return type is Array<SingleResult>, not a ?Array
*/
type PluralIdentifyingRootFieldResolveFn<SingleArgs, SingleResult> = (
  source:mixed, args:{[argName: string]: Array<SingleArgs>},
  context: mixed, info:GraphQLResolveInfo) => Array<SingleResult>;

type PluralIdentifyingRootFieldConfig<SingleArgs, SingleResult> = {
  type: GraphQLNonNull< GraphQLList< GraphQLObjectType>> |
    GraphQLList< GraphQLObjectType>,
  description?: ?string,
  args: PluralFieldArgumentMap,
  resolve:PluralIdentifyingRootFieldResolveFn<SingleArgs, SingleResult>
};

function PluralIdentifyingRootField<SingleArgs, SingleResult> (
config: PluralIdentifyingRootFieldConfig<SingleArgs, SingleResult>
):GraphQLFieldConfig<mixed>  {
  // TODO: Cause of lack of correct recursively type expression,
  // GraphQL use any to cast these type inner.
  // When this https://github.com/facebook/flow/issues/2178 landed,
  // should remove these three any here!
  // any should not be used.
  const type:any = config.type;
  const args:any = config.args;
  const resolve:any = config.resolve;
  return {
    type: type,
    args: args,
    resolve: resolve,
    description: config.description,
  };
}

function nonNullList( v:GraphQLObjectType )
: GraphQLNonNull< GraphQLList< GraphQLObjectType>> {
  return nonNull(list(v));
}

function nonNullListnonNull<T: GraphQLScalarType|GraphQLEnumType|
GraphQLInputObjectType>( v:T ): NonNullListNonNull<T> {
  return nonNull(list(nonNull(v)));
}

export type{
  PluralIdentifyingRootFieldResolveFn,
  PluralIdentifyingRootFieldConfig,
};

export {
  PluralIdentifyingRootField,
  nonNullList,
  nonNullListnonNull
};
