/* @flow */
/**
 * utils for array like connections
 * Specification: https://facebook.github.io/relay/graphql/connections.htm
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
 } from 'graphql';

 import type {
   GraphQLFieldConfigArgumentMap,
   GraphQLFieldConfigMap,
   GraphQLFieldConfig,
   GraphQLFieldResolver
 } from 'graphql';


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
  RelayQLError,
  eFormat,
  invariant
} from '../utils/error.js';

import {
  pro,
  utils
} from 'flow-dynamic';
const {check} = pro;

import type {
  Range
} from 'flow-dynamic';

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
  resolve: GraphQLFieldResolver<TSource, *>;
  deprecationReason?: ?string;
  description?: ?string;
}

// Helper functions

var PREFIX = 'arrayconnection:';

/**
 * Creates the cursor string from an offset.
 */
function offsetToCursor(offset: number): ConnectionCursorJS {
  return base64(PREFIX + offset);
}

/**
 * Rederives the offset from the cursor string.
 */
function cursorToOffset(cursor: ConnectionCursorJS): number {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

function clip(v: ?number, range: Range, _default: number): number {
  return v? utils.clip(v, range, _default) : _default;
}

function testRange(v: number, interval: '[]'|'()'|'[)'|'(]', minMax: number[])
: boolean {
  return utils.testRange(v,
    {interval:interval, min:minMax[0], max: minMax[1]});
}

/*
 * Pagination algorithm.
 *
 * To determine what edges to return, the connection evaluates the before and
 * after cursors to filter the edges, then evaluates first to slice the edges,
 * then last to slice the edges.

 * NOTE: Including a value for both first and last is strongly discouraged,
 * as it is likely to lead to confusing queries and results.
 * The PageInfo section goes into more detail here.
 * NOTE: after and before is a open interval '()'.
**/
/* decodeConnectionArgs()
 * decode ConnectionArgsJS to a ArrayRange ( a  stardard javascript Array Range
 * which start is including )
**/
function decodeConnectionArgs(__args:ConnectionArgsJS,
  maxLength:number): ArrayRange {
  // the default value for _args .
  // after and before is a open interval '()'
  const _defaultArgs = {
    after: -1, // so its -1 here,to include index 0
    first: maxLength,
    before: maxLength, // so its maxLength here too
    last: maxLength,
  };
  const args = setDefault(__args,_defaultArgs);
  invariant ( args.first >= 0 && args.last >= 0 ,
    `first and last must >= 0, ${formatArgs(__args)}`);
  // convert to a closed interval '[]'
  // because first and last is a closed interval
  const start = args.after + 1;
  const end = args.before - 1;
  // invariant 0 <= start <= end <= (maxLength - 1)
  invariant(
    testRange(start, '[]', [0, maxLength-1]) &&
    testRange(end, '[]', [start, maxLength-1])
    , formatArgs(__args) );
  // number of element between after&before
  const count = end - start + 1;
  // if first or last > count, set them to count.
  const first = (args.first > count)? count: args.first;
  const last = (args.last > count)? count: args.last;
  const intersect = first + last - count;
  // if not intersect,means out of range too.
  invariant( intersect > 0 , formatArgs(__args));

  return {
    start: start + (count - last) ,
    length: intersect
  }
}

// for error output
// not sure if needed using `cursorToOffset` here, it will make error msg more
// useful but will expose server data.
function formatArgs(args:ConnectionArgsJS) {
  let msg = 'Out of range: with Args(';
  msg += args.after?`after:${cursorToOffset(args.after)},`
    :`after:${eFormat(args.after)},`;
  msg += `first:${eFormat(args.first)},`;
  msg += args.before?`before:${cursorToOffset(args.before)},`
    :`before:${eFormat(args.before)},`;
  msg += `last:${eFormat(args.last)}).`;
  return msg;
}
// setDefault
type NumberedArgs = {
  after: number,
  first: number,
  before: number,
  last: number,
};
function setDefault(_args:ConnectionArgsJS, _defaultArgs:NumberedArgs)
: NumberedArgs {
  return {
    after: _args.after? cursorToOffset(_args.after): _defaultArgs.after,
    first: _args.first? _args.first: _defaultArgs.first,
    before: _args.before? cursorToOffset(_args.before): _defaultArgs.before,
    last: _args.last? _args.last: _defaultArgs.last
  };
}

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

export {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  cursorToOffset,
  offsetToCursor
} ;
