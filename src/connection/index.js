/* @flow
 *
**/


import {
  relayEdgeMaker
} from './edge.js';

import {
  releyQLConnectionMaker,
  relayQLConnectionFieldSpec,
} from './connection.js';

import {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs
} from './arrayconnection.js';

// -------------- export
const maker = {
  connection:releyQLConnectionMaker,
  edge:relayEdgeMaker
};

const spec = {
  connectionField:relayQLConnectionFieldSpec
};

export {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  maker,
  spec,
} ;
