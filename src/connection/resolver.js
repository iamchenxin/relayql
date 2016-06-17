/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import type {
  ConnectionArgsType,
  ResolvedConnectionArgs
} from './type.js';

import {
  forwardConnectionArgs,
  backwardConnectionArgs
} from './type.js';

/**
 * An flow type alias for cursors in this implementation.
 */
export type ConnectionCursor = string

/**
 * A flow type designed to be exposed as `PageInfo` over GraphQL.
 */
export type PageInfo = {
  startCursor: ?ConnectionCursor,
  endCursor: ?ConnectionCursor,
  hasPreviousPage: ?boolean,
  hasNextPage: ?boolean
}

/**
 * A flow type designed to be exposed as a `Connection` over GraphQL.
 */
export type Connection<NodeType> = {
  edges: Array<Edge<NodeType>>;
  pageInfo: PageInfo;
}

/**
 * A flow type designed to be exposed as a `Edge` over GraphQL.
 */
export type Edge<NodeType> = {
  node: NodeType;
  cursor: ConnectionCursor;
}


type ArrayRange = {
  start: number;
  length: number;
};

function fromArray<NodeType>(
  data: Array<NodeType>,
  args: ResolvedConnectionArgs,
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

// Helper functions

var PREFIX = 'arrayconnection:';

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset: number): ConnectionCursor {
  return base64(PREFIX + offset);
}

/**
 * Rederives the offset from the cursor string.
 */
export function cursorToOffset(cursor: ConnectionCursor): number {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

/**
 * Given an optional cursor and a default offset, returns the offset
 * to use; if the cursor contains a valid offset, that will be used,
 * otherwise it will be the default.
 */
export function getOffsetWithDefault(
  cursor?: ?ConnectionCursor,
  defaultOffset: number
): number {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  var offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}

/**
 * clip a array's range by clipper
 * ex: 5(L:60) slice by 62(L:10) = 62(L:3)
 */

function clipRange(dataRange:ArrayRange,slice:ArrayRange):ArrayRange {
  const minLength = 1;
  const minStart = dataRange.start;
  const maxStart = dataRange.start + dataRange.length - minLength ;
  const newStart = clipValue(slice.start, minStart, maxStart);
  const maxLength = dataRange.length - (newStart - dataRange.start);
  return {
    start:newStart,
    length:clipValue(slice.length, minLength, maxLength)
  };
}

function clipMeta(meta:ArraySliceMetaInfo, arraylength:number)
:ArraySliceMetaInfo {
  const start = 0;
  const maxLength = arraylength - meta.sliceStart;
  let rt = {
    sliceStart: meta.sliceStart,
    arrayLength: meta.arrayLength
  };
  if (meta.sliceStart<=start) {
    rt.sliceStart = start;
  } else if (meta.sliceStart >= arraylength) {
    rt.sliceStart = arraylength - 1;
  }

  if (meta.arrayLength >= maxLength) {
    rt.arrayLength = maxLength;
  }

  return rt;
}

function clipValue(value:number,min:number,max:number):number {
  if(value<=min){
    return min;
  } else if (value>=max) {
    return max;
  }
}

type ArrayRange = {
  start:number,
  end:number
};

function getRangeFromArgs(args:ResolvedConnectionArgs):ArrayRange {
  if ( args.first && args.after) {
    const first:number = args.first;
    const after:number = getOffsetWithDefault(args.after, 0);
    return {
      start:after,
      length:first
    };
  } else if (args.last && ) {
    let before = getOffsetWithDefault(args.after, 0);
    return {
      start: before - args.last,
      length: args.last
    };
  } else {
    throw new Error(`Bad Args[${args}] for Connections.`);
  }
}


export {
  fromArray
};
