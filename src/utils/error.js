/* @flow
 *
 */

// Error
import {
  inspect
} from 'util';

class ExtendableError extends Error {
  code: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.code = code ? code : 'error';
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class RelayQLError extends ExtendableError{}

function eFormat(v:mixed):string {
  return inspect(v,
    { showHidden: true, depth: null });
}

export default function invariant(condition: mixed, message: string|Error) {
  if (!condition) {
    const err = (message instanceof Error)? message : new RelayQLError(message);
    throw err;
  }
}

export {
  RelayQLError,
  eFormat,
  invariant
};
