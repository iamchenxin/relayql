/* @flow
*
*/
type TypeCaster<T> = (v:mixed) => T;

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
  },
  nullable<T>(v:T):?T {
    if (v==null) {
      return null;
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



class Pro2<T> {
  v:T;
  constructor(v:T) {
    this.v=v;
  }
  string():string {
    if (typeof this.v !== 'string') {
      throw new Error(`value:(${this.v}) should be string.`);
    }
    return this.v;
  }
}
const pro2 = {
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
  },
  nullable<T>(v:T):?T {
    if (v==null) {
      return null;
    }
    return v;
  }
};

function MK<T>(v:mixed, f:TypeCaster<T>):T {
  return f(v);
}

function Nulla1<T>(v:mixed, fun:TypeCaster<T>):?T {
  if (v==null) {return null;}
  return fun(v);
}

function Nulla<T>(f:(fv:mixed)=>T):(nv:mixed)=>?T {
  return function(v:mixed):?T {
    if (v===null) {return null;}
    return f(v);
  };
}

function MkUndefined<T>(f:TypeCaster<T>):(v:mixed) => void {
  return function(v:mixed):void {
    if (typeof v === 'undefined') {return undefined;}
    throw new Error('!');
  };
}


export {
  dev, pro, Nulla,MkUndefined
};
