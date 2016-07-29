/* @flow
 *
**/

import {
  StarWarsSchema
} from './starWarsSchema.js';

import {
  printSchema
} from 'flow-graphql';

import fs from 'fs';

function pt() {
  const rt = printSchema(StarWarsSchema, 'hierarchy');
  fs.writeFile('./example/starWars.shema',rt,err => console.log('finish!'));
  console.log(rt);
}

pt();
