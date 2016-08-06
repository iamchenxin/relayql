/* @flow
 *
**/

declare var jest: Function;
declare var describe: Function;
declare var it: Function;
declare var expect: Function;

jest.unmock('flow-graphql');
jest.unmock('flow-dynamic');

import {
  encodeId,
  decodeId,
} from '../../src/node/index.js';

describe('Basic usage for graphql', () => {
  it('', () => {
    const rt = encodeId('name', 'ST8523');
    expect(rt).toEqual('bmFtZTpTVDg1MjM=');
  });
});
