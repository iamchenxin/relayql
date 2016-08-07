/* @flow
 *
**/

import {
  encodeId,
  decodeId,
  idField,
} from './globalid.js';

import {
  nodeInterface,
  nodeInterfaceField,
  nodableType,
} from './node.js';

import {
  nonNullList,
  nonNullListnonNull,
  pluralIdentifyingRootField,
} from './plural.js';

export {
  encodeId,
  decodeId,
  idField,
  nodeInterface,
  nodeInterfaceField,
  nodableType,
  nonNullList,
  nonNullListnonNull,
  pluralIdentifyingRootField,
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
