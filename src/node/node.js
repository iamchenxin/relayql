/** @flow
 *
 * The GraphQL Node type (interface)
 * A interface
**/

import {
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} from 'flow-graphql';

import type {
  GraphQLResolveInfo,
  GraphQLFieldConfig,
  GraphQLIsTypeOfFn
} from 'flow-graphql';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  Thunk
} from '../def/common.js';

import type {
  ResolvedGID
} from './globalid.js';

import {
  decodeId
} from './globalid.js';

import {
  pro
} from 'flow-dynamic';
const {
  argsCheck,
  check1,
  isString
} = pro;

import {RelayQLError, eFormat} from '../utils/error.js';

type NodeTypeResolverFn = (source: {_resolvedId: ResolvedGID})
  => ?GraphQLObjectType;
// Make a Relay's Node Interface
// A interface is used to dynamic resolve to a certain Type,like other language
function relayQLNodeMaker(typeResolver:NodeTypeResolverFn)
:GraphQLInterfaceType {
  const rt = new GraphQLInterfaceType({
    name: 'Node',
    description: 'An interface with an ID',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The id of the object.',
      },
    }),
    resolveType: check1(
      source => ({
        _resolvedId: { // user should not use _resolvedId as a key,its a reserved name
          id: isString(source.id),
          type: isString(source.type)
        }
      }),
      typeResolver)
  });
  //console.log(ePrint(GraphQLInterfaceType.mock));
  return rt;
}


type RelayQLFieldConfigMap<TSource, TResult> = {
  id:GraphQLFieldConfig<*, *>,
  [fieldName: string]: GraphQLFieldConfig<TSource, TResult>;
};
type RelayQLNodableTypeConfig<TSource, TResult> = {
  name: string,
  interfaces: Thunk<?Array<GraphQLInterfaceType>>;
  fields: Thunk<RelayQLFieldConfigMap<TSource, TResult>>;
  isTypeOf?: ?GraphQLIsTypeOfFn;
  description?: ?string
}
function relayQLNodableType<TSource, TResult>(
config: RelayQLNodableTypeConfig<TSource, TResult>) {
  return new GraphQLObjectType(config);
}

type GetDataByRGIDFn = (resolvedId:ResolvedGID, context: mixed,
  info: GraphQLResolveInfo) => {[key:string]:mixed} ;

// Make a field,which used Node,as a interface to get any type extend from Node.
// accept a args(id: string) id is globalid , resolve a ResolvedGID to downsteam
// it is most used as a top-level source.
function relayQLNodeField(nodeItf:GraphQLInterfaceType,
resolver:GetDataByRGIDFn, idDecoder?: (gid:string) => ResolvedGID)
:GraphQLFieldConfig<*, *> {
  return {
    name: 'node',
    description: 'Fetches an object given its ID',
    type: nodeItf,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The ID of an object'
      }
    },
    resolve: argsCheck(
      args => ({id: isString(args.id) }),
      (obj, {id}, context, info) =>
        {
          const _resolvedId = idDecoder?idDecoder(id):decodeId(id);
          let data = resolver(_resolvedId, context, info);
          data._resolvedId = _resolvedId;
          return data;
        }
    )
  };
}


export type {
  RelayQLFieldConfigMap,
  RelayQLNodableTypeConfig,
  NodeTypeResolverFn,
  GetDataByRGIDFn
};

export {
  relayQLNodeMaker,
  relayQLNodableType
  relayQLNodeField,
};
