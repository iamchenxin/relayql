/* @flow
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This defines a basic set of data for our Star Wars Schema.
 *
 * This data is hard coded for the sake of the demo, but you could imagine
 * fetching this data from a backend service rather than from hardcoded
 * JSON objects in a more complex demo.
 */
/* eslint quote-props: ["error", "as-needed",
{ "keywords": true, "unnecessary": false }]*/

var xwing = {
  id: '1',
  name: 'X-Wing-Jim',
};

var ywing = {
  id: '2',
  name: 'Y-Wing-Mike',
};

var awing = {
  id: '3',
  name: 'A-Wing',
};

// Yeah, technically it's Corellian. But it flew in the service of the rebels,
// so for the purposes of this demo it's a rebel ship.
var falcon = {
  id: '4',
  name: 'Millenium Falcon',
};

var homeOne = {
  id: '5',
  name: 'Home One',
};

var tieFighter = {
  id: '6',
  name: 'TIE Fighter',
};

var tieInterceptor = {
  id: '7',
  name: 'TIE Interceptor',
};

var executor = {
  id: '8',
  name: 'Executor',
};

var rebels = {
  id: '1',
  name: 'Alliance to Restore the Republic',
  ships: ['1', '2', '3', '4', '5']
};

var empire = {
  id: '2',
  name: 'Galactic Empire',
  ships: ['6', '7', '8']
};

var data = {
  Faction: {
    '1': rebels,
    '2': empire
  },
  Ship: {
    '1': xwing,
    '2': ywing,
    '3': awing,
    '4': falcon,
    '5': homeOne,
    '6': tieFighter,
    '7': tieInterceptor,
    '8': executor
  }
};

type ShipDT = {
  id: string,
  name: string,
};

type FactionDT = {
  id: string,
  name: string,
  ships: string[],
};

var nextShip = 9;
function createShip(shipName: string, factionId: string): ShipDT {
  var newShip = {
    id: '' + (nextShip++),
    name: shipName
  };
  data.Ship[newShip.id] = newShip;
  data.Faction[factionId].ships.push(newShip.id);
  return newShip;
}

function getShip(id: string): ShipDT {
  return data.Ship[id];
}

function getFaction(id: string): FactionDT {
  return data.Faction[id];
}

function getRebels(): FactionDT {
  return rebels;
}

function getEmpire(): FactionDT {
  return empire;
}

export {
  createShip,
  getShip,
  getFaction,
  getRebels,
  getEmpire
};

export type {
  ShipDT,
  FactionDT
};
