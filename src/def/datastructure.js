/* @flow
*/

/*
 * the js data structure which cosresponding relay's schema
 * Basiclly the finally result is the datas send to client
 * A flow type designed to be exposed as a JStype over GraphQL.

 * Relay have two data entrance
 * 1. node(id: ID!) ,get data by global id.
 * 2. ConnectionArgsJS, input by a Connection field args.
 * get a connections by args.
*/

type NodeJS = { // the interface of NodeType
  id: string // should custom by Relay
};

type NodableJS = { // type extend from Node interface
    id: string,
    [key:string]:mixed
};

type ConnectionCursorJS = string // should custom by Relay
type EdgeJS<NodeType: NodeJS> = {
  node: NodeType;
  cursor: ConnectionCursorJS; // should custom by Relay
}

type PageInfoJS = {
  startCursor: ?ConnectionCursorJS,
  endCursor: ?ConnectionCursorJS,
  hasPreviousPage: boolean,
  hasNextPage: boolean
}
type ConnectionJS<NodeType: NodeJS> = {
  edges: EdgeJS<NodeType>[];
  pageInfo: PageInfoJS; // should custom by Relay
}


// This is a args which input into a Connection field
// and the Connection field resolver should fill a Connection
// Connection{edges, pageInfo}
type ForwardArgsJS = {
  after: ConnectionCursorJS,
  first: number
};
type BackwardArgsJS = {
  before: ConnectionCursorJS,
  last: number
};

/*
 * should be --> type ConnectionArgsJS = ForwardArgsJS|BackwardArgsJS;
 * But GraphQL can not express `or Type`
 * so ...
**/
type ConnectionArgsJS = {
  after?: ConnectionCursorJS,
  first?: number,
  before?: ConnectionCursorJS,
  last?: number,
};

// This is a ConnectionArgsJS resolved in an array connection
type ArrayRange = {
  start: number;
  length: number;
};

export type {
  NodeJS,
  NodableJS,
  ConnectionCursorJS,
  EdgeJS,
  PageInfoJS,
  ConnectionJS,
  ForwardArgsJS,
  BackwardArgsJS,
  ConnectionArgsJS,
  ArrayRange
};
