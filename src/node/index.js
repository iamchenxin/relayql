/* @flow
 *
**/

import {
  encodeId,
  decodeId,
  maker as id_maker
} from './globalid.js';

import {
  maker as node_maker,
  spec as node_spec
} from './node.js';

import {
  maker as plu_maker,
  spec as plu_spec,
  nonNullList,
  nonNullListnonNull
} from './plural.js';

const maker = {
  ...id_maker,
  ...node_maker,
  ...plu_maker
};
const spec = {
  ...node_spec,
  ...plu_spec
};

export {
  encodeId,
  decodeId,
  nonNullList,
  nonNullListnonNull,
  maker,
  spec,
};

// -------- export type-------------

import type {
  NodeInfo,
  GIDEncodeFn,
} from './globalid.js';

import type {
  NodableFieldConfigMap,
  NodableTypeConfig,
  NodeTypeResolverFn,
  GetDataByNodeInfoFn,
} from './node.js';

import type{
  PluralIdentifyingRootFieldResolveFn,
  PluralIdentifyingRootFieldConfig,
} from './plural.js';

export type{
  NodeInfo,
  GIDEncodeFn,
  NodableFieldConfigMap,
  NodableTypeConfig,
  NodeTypeResolverFn,
  GetDataByNodeInfoFn,
  PluralIdentifyingRootFieldResolveFn,
  PluralIdentifyingRootFieldConfig,
};
