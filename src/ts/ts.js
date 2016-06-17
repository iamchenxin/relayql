/* @flow
 *
 */

import {
  dynamicCheck,
  dev,
  pro,
  Nulla,MkUndefined
} from '../check';

import type {
  Checker
} from '../check';

function ts() {
  const resolver = dynamicCheck(
    (source:{book:string}) => {

      console.log(source.book);
    }, (source:any) => {
    return {
      book:pro.string(source.book)
    };
  });

  const source = {
    boo:'hehehe'
  };
  resolver(source, {a:null}, null);
}



function ts2() {
  type USER = {
    name:string,
    age:?number
  };
  const checker = (source) => ({
    name:pro.string(source.name),
    age:MkUndefined(pro.number)(source.age)
  });
  type ARGS = {
    input:{
      id:string
    }
  };
  const argsChecker = (args) => ({
    input:{
      id:pro.string(args.input.id)
    },
  });

  const resolver = dynamicCheck(
    (source:USER, args:ARGS ) => {
      const {name, age} = source;
      const n:string = 1+name;
      const id:string = args.input.id;
    }, checker, argsChecker);

  const data = {
    name:'的话',
    age:27
  };
  const a = {
    input:{
      i:'aaa'
    }
  };

  resolver(data, a, null);
}

ts2();
