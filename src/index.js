/* @flow
 *
**/

import {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  maker as connection_maker,
  spec as connection_spec
} from './connection/index.js';

import {
  encodeId,
  decodeId,
  nonNullList,
  nonNullListnonNull,
  maker as node_maker,
  spec as node_spec
} from './node/index.js';

import {
  maker as mutation_maker
} from './mutation/mutation.js';

import {
  resolveThunk
} from './def/common.js';

const maker = {
  ...connection_maker,
  ...node_maker,
  ...mutation_maker
};

const spec = {
  ...connection_spec,
  ...node_spec
};

export {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  encodeId,
  decodeId,
  nonNullList,
  nonNullListnonNull,
  resolveThunk,
  maker,
  spec
};

// export type ---------
export type {
  NodeJS,
  NodableJS,
  ConnectionCursorJS,
  EdgeJS,
  PageInfoJS,
  ConnectionJS,
  ForwardArgsJS,
  BackwardArgsJS,
  ConnectionArgsJS,
  ArrayRange
} from './def/datastructure.js';

export type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  CusTomType,
  NonNullRelayType,
  GraphQLResolveInfo
} from './def/common.js';
