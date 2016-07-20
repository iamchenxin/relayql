/* @flow
 *
**/

import type {
  ResolvedGID,
  GIDEncodeFn
} from './globalid.js';

import {
  encodeId,
  decodeId,
  relayQLIdField
} from './globalid.js';

import type {
  RelayQLFieldConfigMap,
  RelayQLNodableTypeConfig,
  NodeTypeResolverFn,
  GetDataByRGIDFn
} from './node.js';

import {
  relayQLNodeMaker,
  relayQLNodableType,
  relayQLNodeField,
} from './node.js';

// -------- export -------------

export type{
  ResolvedGID,
  GIDEncodeFn,
  RelayQLFieldConfigMap,
  RelayQLNodableTypeConfig,
  NodeTypeResolverFn,
  GetDataByRGIDFn
};

export {
  encodeId,
  decodeId,
  relayQLIdField,
  relayQLNodeMaker,
  relayQLNodableType,
  relayQLNodeField,
};
