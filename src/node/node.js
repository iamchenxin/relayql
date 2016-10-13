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
} from 'graphql';

import type {
  GraphQLResolveInfo,
  GraphQLFieldConfig,
  GraphQLIsTypeOfFn
} from 'graphql';

import type {
  TypeResolverFn,
  ResolverFn,
  RelayField,
  Thunk
} from '../def/common.js';

import type {
  NodableJS
} from '../def/datastructure.js';

import type {
  NodeInfo
} from './globalid.js';

import {
  decodeId
} from './globalid.js';

import {
  pro,
  dev
} from 'flow-dynamic';
const {
  argsCheck,
  check1,
  isString
} = pro;

import {RelayQLError, eFormat} from '../utils/error.js';

type NodeTypeResolverFn = (source: {_nodeInfo: NodeInfo})
  => ?GraphQLObjectType;
// Make a Relay's Node Interface
// A interface is used to dynamic resolve to a certain Type,like other language
function nodeInterfaceMaker(typeResolver:NodeTypeResolverFn)
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
    resolveType: dev.check1(
      source => ({
        _nodeInfo: { // user should not use _nodeInfo as a key,its a reserved name
          serverId: isString(source.serverId),
          type: isString(source.type)
        }
      }),
      typeResolver)
  });

  return rt;
}

// nodeInterfaceField
type GetDataByNodeInfoFn<NodableData> = (_nodeInfo:NodeInfo, context: mixed,
  info: GraphQLResolveInfo) => NodableData;

// Make a field,which used Node,as a interface to get any type extend from Node.
// accept a args(id: string) id is globalid , resolve a NodeInfo to downsteam
// it is most used as a top-level source.
function nodeInterfaceFieldMaker<NodableData>(nodeItf:GraphQLInterfaceType,
resolver:GetDataByNodeInfoFn<NodableData>, idDecoder?: (gid:string) => NodeInfo)
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
      (obj, {id}, context, info) =>{
        const _nodeInfo = idDecoder?idDecoder(id):decodeId(id);
        let data:any = resolver(_nodeInfo, context, info);
        data._nodeInfo = _nodeInfo;
        return data;
      }
    )
  };
}

// nodableType
type NodableFieldConfigMap<TSource> = {
  id:GraphQLFieldConfig<TSource, *>,
  [fieldName: string]: GraphQLFieldConfig<TSource, *>;
};
type NodableTypeConfig<TSource> = {
  name: string,
  interfaces: Thunk<?Array<GraphQLInterfaceType>>;
  fields: Thunk<NodableFieldConfigMap<TSource>>;
  isTypeOf?: ?GraphQLIsTypeOfFn<TSource, *>;
  description?: ?string
}

function nodableTypeSpec<TSource>(
config: NodableTypeConfig<TSource>): GraphQLObjectType {
  return new GraphQLObjectType(config);
}

// export
const nodeInterface = {
  maker:nodeInterfaceMaker
};
const nodeInterfaceField = {
  maker:nodeInterfaceFieldMaker
};
const nodableType = {
  spec:nodableTypeSpec
};

export {
  nodeInterface,
  nodeInterfaceField,
  nodableType
};

// export type
export type {
  NodableFieldConfigMap,
  NodableTypeConfig,
  NodeTypeResolverFn,
  GetDataByNodeInfoFn
};
