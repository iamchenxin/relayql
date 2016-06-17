/* @flow
*
*/
import type {
  GraphQLResolveInfo
} from 'flow-graphql';

import {
  inspect
} from 'util';

type DynamicCheckResolver = (source:mixed, args:{[key:string]:any},
    context:mixed, info?:GraphQLResolveInfo) => mixed;


type Checker<CheckType> = (data: any) => CheckType;

// dynamic Checker
function dynamicChecker<SourceT >(
  resolver:(source:SourceT ) => mixed,
  checker:Checker<SourceT>
):DynamicCheckResolver  {
  function dynamicResoler(source:mixed, args:{[key:string]:mixed },
    context:mixed, info?:GraphQLResolveInfo):mixed {
    try{
      const rt = checker(source);
      return resolver(rt);
    } catch (e){
      let txt = `${e}`;
      if(source){
        txt = `Dynamic Check failed!\n${txt}\nwith data \n` + inspect(source,
          { showHidden: true, depth: null, colors:true });
      }
      throw new Error(txt);
    }
  }
  return dynamicResoler;
}

const pro = {
  string(v:mixed):string {
    if (typeof v !== 'string') {
      throw new Error(`value:(${v}) should be string.`);
    }
    return v;
  },
  number(v:mixed):number {
    if (typeof v !== 'number') {
      throw new Error(`value:(${v}) should be number.`);
    }
    return v;
  }
};

let dev = pro;
if (process.env.NODE_ENV != 'dev') {
  function _copy(v:mixed):any {
    return v;
  }
  dev = {
    string:_copy,
    number:_copy
  };
}

// ----------------------------

type Book = {
  name:string,
  content:number,
  comment:{
    name:string,
    txt:string
  }
};

// $FlowIssue: aa
function resChecker(source:any):Book {
  const rt = {
    name:pro.string(source.name),
    content:dev.number(source.content),
    comment:{
      name:pro.string(source.comment.name),
      txt:pro.string(source.comment.txt)
    }
  };
  return rt;
}

function myRes(source:Book):mixed {
  const n = source.comment.name;
  const nn:string = n;
  console.log(nn);
  const v:number = 1 + source.content;
  console.log(v);
}

function ts() {
  const dResolve = dynamicChecker(myRes, resChecker);

  const data = {
    name:'的话',
    content:1,
    comment:{
      name:'学友',
      txt:'hello'
    }
  };

  dResolve(data, {a:'a'}, null);
}

ts();
