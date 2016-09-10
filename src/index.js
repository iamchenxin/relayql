/* @flow
 *
**/

import {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  edge,
  connection,
  connectionField,
} from './connection/index.js';

import {
  encodeId,
  decodeId,
  idField,
  nodeInterface,
  nodeInterfaceField,
  nodableType,
  nonNullList,
  nonNullListnonNull,
  pluralIdentifyingRootField,
} from './node/index.js';

import {
  mutation,
} from './mutation/mutation.js';

import {
  resolveThunk
} from './def/common.js';

export {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  edge,
  connection,
  connectionField,
  encodeId,
  decodeId,
  idField,
  nodeInterface,
  nodeInterfaceField,
  nodableType,
  nonNullList,
  nonNullListnonNull,
  pluralIdentifyingRootField,
  mutation,
  resolveThunk,
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

export type {
  MutationConfig,
  mutationFn
} from './mutation/mutation.js';
