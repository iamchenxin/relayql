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
const edge = {
  maker: relayEdgeMaker
};
const connection = {
  maker: releyQLConnectionMaker
};
const connectionField = {
  spec: relayQLConnectionFieldSpec
};

export {
  pageInfoFromArray,
  edgesFromArray,
  decodeConnectionArgs,
  edge,
  connection,
  connectionField,
} ;
