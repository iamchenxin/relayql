/* @flow
 *
 */

// Error
import {
  inspect
} from 'util';

function RelayQLError(message:string):void {
  this.name = 'RelayQLError';
  this.message = message || 'RelayQL Error';
  this.stack = (new Error()).stack;
}
RelayQLError.prototype = Object.create(Error.prototype);
RelayQLError.prototype.constructor = RelayQLError;

function eFormat(v:mixed):string {
  return inspect(v,
    { showHidden: true, depth: null });
}

export {
  RelayQLError,
  eFormat
};
