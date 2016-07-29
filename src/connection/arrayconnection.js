/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

 import {
   GraphQLBoolean,
   GraphQLInt,
   GraphQLNonNull,
   GraphQLList,
   GraphQLObjectType,
   GraphQLInterfaceType,
   GraphQLString,
   GraphQLScalarType
 } from 'flow-graphql';

 import type {
   GraphQLFieldConfigArgumentMap,
   GraphQLFieldConfigMap,
   GraphQLFieldConfig,
   GraphQLFieldResolveFn
 } from 'flow-graphql';


import type {
  ConnectionArgsType
} from './connection.js';

import {
  forwardConnectionArgs,
  backwardConnectionArgs
} from './connection.js';

import {
  relayEdgeMaker
} from './edge.js';

import {
  base64,
  unbase64
} from '../utils/base64.js';

import {
  pro,
  utils
} from 'flow-dynamic';
const {check} = pro;

import type {
  NodeJS,
  ConnectionCursorJS,
  EdgeJS,
  PageInfoJS,
  ConnectionJS,
  ForwardArgsJS,
  BackwardArgsJS,
  ConnectionArgsJS,
  ArrayRange
} from '../def/datastructure.js';

type ArrayConnectionFieldConfig<TSource> = {
  type: GraphQLObjectType;
  args?: ConnectionArgsType;
  resolve: GraphQLFieldResolveFn<TSource, *>;
  deprecationReason?: ?string;
  description?: ?string;
}
/*
function fromArray<NodeType>(
  data: Array<NodeType>,
  args: ConnectionArgsJS,
  slice?: ArrayRange
):Connection<NodeType> {
  let arrayRange = {
    start: 0,
    length: data.length
  };
  if (slice) {
    arrayRange = clipRange(arrayRange, slice);
  }

  const {first, last} = args;
  const before = getOffsetWithDefault(args.before, meta.arrayLength);
  const after = getOffsetWithDefault(args.after, -1);

}
*/

// Helper functions

var PREFIX = 'arrayconnection:';

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset: number): ConnectionCursorJS {
  return base64(PREFIX + offset);
}

/**
 * Rederives the offset from the cursor string.
 */
export function cursorToOffset(cursor: ConnectionCursorJS): number {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

/**
 * Given an optional cursor and a default offset, returns the offset
 * to use; if the cursor contains a valid offset, that will be used,
 * otherwise it will be the default.
 */
export function getOffsetWithDefault(
  cursor?: ?ConnectionCursorJS,
  defaultOffset: number
): number {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  var offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}


function decodeConnectionArgs(_args:ConnectionArgsJS,
  maxLength:number): ArrayRange{
  if (typeof _args.first === 'number') {
    const args = {
      first:_args.first,
      after:_args.after
    };
    const length = utils.clip(args.first, {
      intervals:'[]', min:1, max:maxLength
    }, 1);
    let start = args.after?cursorToOffset(args.after):0;
    start = utils.clip(start, {
      intervals:'[]', min:0, max:maxLength-1
    }, 0);
    return {
      start,
      length
    };
  } else if (typeof _args.last === 'number') {
    const args = {
      last:_args.last,
      before:_args.before
    };
    const length = utils.clip(args.last, {
      intervals:'[]', min:1, max:maxLength
    }, 1);
    const before = args.before? cursorToOffset(args.before): maxLength-1;
    let start = before - length;
    start = utils.clip(start, {
      intervals:'[]', min:0, max:maxLength-1
    }, 0);
    return {
      start,
      length
    };
  } else {
    return {
      start: 0,
      length: maxLength
    };
  }
}
/*
function arrayRelayEdgeMaker<TSource>(name:string,
node: GraphQLFieldConfig<TSource>): GraphQLObjectType {


  return new GraphQLObjectType({
    name: name + 'Edge',
    description: 'An edge in a connection.',
    fields: () => ({
      node:{
        type: GraphQLInterfaceType,
        resolve: GraphQLFieldResolveFn<TSource, *>,
    //    description?: string //for flow check,do not need input
      },
      cursor: {
        resolve: GraphQLFieldResolveFn<TSource, *>,
    //    type?:  GraphQLNonNull<GraphQLScalarType>, //FLOW-ARGS:do not need input
    //    description?: string //FLOW-ARGS:do not need input
      },
    }),
  });
}
*/

function edgesFromArray<T: NodeJS>(data: Array<T>, range: ArrayRange)
: EdgeJS<T>[] {
  const slice = data.slice(range.start,range.start+range.length);
  return slice.map((v,index) => ({
    cursor: offsetToCursor(range.start + index),
    node: v
  }));
}

function pageInfoFromArray(edges: EdgeJS<*>[],
  edgesRange: ArrayRange, dataLength: number) {
  if( edges.length <= 0 ) {
    return {
      startCursor: null,
      endCursor: null,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  } else {
    return {
      startCursor: edges[0].cursor,
      endCursor: edges[edges.length - 1].cursor,
      hasPreviousPage: edgesRange.start > 0,
      hasNextPage: (edgesRange.start + edgesRange.length) < dataLength
    };
  }
}

function arrayConnectionField<TSource>(
  config: ArrayConnectionFieldConfig<TSource>): GraphQLFieldConfig<TSource> {

  const checkedFn = check(
    (src:TSource ):TSource => src,
    args => decodeConnectionArgs(args,65660),
    null,
    config.resolve
  );
  return {
    type: config.type,
    args: config.args,
    resolve: checkedFn,
    deprecationReason: config.deprecationReason,
    description: config.description,
  };
}

export {
  pageInfoFromArray,
  arrayConnectionField,
  edgesFromArray,
  decodeConnectionArgs
} ;
