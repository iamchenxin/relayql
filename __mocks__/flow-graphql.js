'use strict';
console.log(' genMockFromModule flow-graphql ');
//const graphql = jest.genMockFromModule('flow-graphql');

const JestFn = jest.fn();
/*
function GraphQLNonNull(data) {
  JestFn.call(this,data);
}
GraphQLNonNull.prototype = Object.create(JestFn.prototype);
GraphQLNonNull.prototype.constructor = GraphQLNonNull;
*/
class GraphQLNonNull extends JestFn {
  constructor(data) {
    super(data);
  }
}

module.exports = {
  GraphQLInterfaceType:jest.fn(),
  GraphQLNonNull:GraphQLNonNull,
  GraphQLID:jest.fn(),
  GraphQLObjectType:jest.fn(),
  GraphQLString:jest.fn()
};
