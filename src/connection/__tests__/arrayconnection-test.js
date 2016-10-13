/* @flow
 *
**/
/* because connection.js was imported in arrayconnection.js
 * so we can not unmock it here.
 * so use our global manul mock
jest.unmock('graphql');
jest.unmock('../connection.js');
*/
jest.unmock('flow-dynamic');
jest.unmock('../../utils/error.js');

declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var expect: Function;


import {
  decodeConnectionArgs,
  offsetToCursor,
  cursorToOffset
} from '../arrayconnection.js';

import type {
  ConnectionJS,
} from '../def/datastructure.js';
import {
  RelayQLError,
  eFormat
} from '../../utils/error.js';

type Args = {
  after?: number,
  first?: number,
  before?: number,
  last?: number,
}
const toS = offsetToCursor;

function teee() {
  throw new Error('teee!!!');
}
function decodeErrMsg(after:number,first:number,
before:number,last:number):string {
  let msg = 'Out of range: with Args(';
  msg += after?`after:${after},`
    :`after:${eFormat(after)},`;
  msg += `first:${eFormat(first)},`;
  msg += before?`before:${before},`
    :`before:${eFormat(before)},`;
  msg += `last:${eFormat(last)}).`;
  return msg;
}

describe('arrayconnection', () => {
  const ar = ['a','b','c','d','e','f','g'];
  function testDecodeArgs(after, first, before, last, maxLength) {
    try {
      return decodeConnectionArgs({
        after: after?toS(after):null,
        first: first,
        before: before?toS(before):null,
        last: last,
      }, maxLength?maxLength:ar.length);
    } catch (e) {
      throw e;
    }
  }

  describe('arrayconnection', () => {

    /*
     * Pagination algorithm.
     *
     * To determine what edges to return, the connection evaluates the before and
     * after cursors to filter the edges, then evaluates first to slice the edges,
     * then last to slice the edges.
    **/
    it('basic', () => {
      expect( testDecodeArgs(1, 5, 3, 2) ).toEqual({ start: 2, length: 1 });
      expect( testDecodeArgs(1, 5, 5, 3) ).toEqual({ start: 2, length: 3 });
      expect( testDecodeArgs(1, 6, null, 3)).toEqual({ start: 4, length: 3 });
      // after or before can be null
      expect(testDecodeArgs(null, 6, null, 3)).toEqual({ start: 4, length: 2 });
    });

    it('after or before can be null', () => {
      // if null after is set to -1, before is set to maxLength
      // because they are open interval '()', -1 to include first data.
      expect( testDecodeArgs(null, 5, null, 3) )
        .toEqual({ start: 4, length: 1 });
      expect( testDecodeArgs(1, 6, null, 3))
        .toEqual({ start: 4, length: 3 });
      expect(testDecodeArgs(null, 6, 6, 3))
        .toEqual({ start: 3, length: 3 });
    });

    it('before and after must in range (-1, maxLength)', () => {
      // after or before can be null
      expect(testDecodeArgs(-1, null, null, 3))
        .toEqual({ start: 4, length: 3 });
      expect(testDecodeArgs(-1, null, 7, 3))
        .toEqual({ start: 4, length: 3 });
      expect( () => { testDecodeArgs(-2, 6, null, 6); } )
        .toThrowError(RelayQLError, decodeErrMsg(-2, 6, null, 6) );
      expect( () => { testDecodeArgs(-1, null, 8, 3); } )
        .toThrowError(RelayQLError, decodeErrMsg(-1, null, 8, 3) );

    });

    it('should not out of the given data range', () => {
      // after, first, before, last, maxLength
      expect( () => { testDecodeArgs(10, 6, 15, 6, 7); } )
        .toThrowError(RelayQLError, decodeErrMsg(10, 6, 15, 6, 7) );
    });

    it('if first or last > maxLength, just treated as maxLength', () => {
      expect(testDecodeArgs(1, 999, 5, 999))
        .toEqual({ start: 2, length: 3 });
      expect(testDecodeArgs(1, 999, 5, 2))
        .toEqual({ start: 3, length: 2 });
    });

  });

});
