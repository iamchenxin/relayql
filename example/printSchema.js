/* @flow
 *
**/

import {
  StarWarsSchema
} from './starWarsSchema.js';

import {
  printSchema
} from 'graphql';

import fs from 'fs';

function pt() {
  const rt = printSchema(StarWarsSchema, 'hierarchy');
  fs.writeFile('./example/starWars.shema',rt,err => console.log('finish!'));
  console.log(rt);
}

pt();
