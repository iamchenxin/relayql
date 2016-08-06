/** @flow
 *
 * The GraphQL connections type
**/

import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'flow-graphql';

import type {
  GraphQLFieldConfig,
  InputObjectConfigFieldMap,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo
} from 'flow-graphql';

import {
  resolveThunk
} from '../def/common.js';

import {
  pro
} from 'flow-dynamic';
const {
  argsCheck,
  isObject
} = pro;

type mutationFn =
  (args: Object, ctx: mixed, info: GraphQLResolveInfo) => Object |
  (args: Object, ctx: mixed, info: GraphQLResolveInfo) => Promise<Object>;

/**
 * A description of a mutation consumable by mutationWithClientMutationId
 * to create a GraphQLFieldConfig for that mutation.
 *
 * The inputFields and outputFields should not include `clientMutationId`,
 * as this will be provided automatically.
 *
 * An input object will be created containing the input fields, and an
 * object will be created containing the output fields.
 *
 * mutateAndGetPayload will receieve an Object with a key for each
 * input field, and it should return an Object with a key for each
 * output field. It may return synchronously, or return a Promise.
 */
type MutationConfig<TSource> = {
  name: string,
  inputFields: InputObjectConfigFieldMap,
  payloadFields: GraphQLFieldConfigMap<TSource>,
  mutateAndGetPayload: mutationFn,
}

/**
 * Returns a GraphQLFieldConfig for the mutation described by the
 * provided MutationConfig.
 */
function mutationWithClientMutationId<TSource>(
  config: MutationConfig<TSource>
): GraphQLFieldConfig<TSource> {
  var {name, inputFields, payloadFields, mutateAndGetPayload} = config;
  var augmentedInputFields = () => ({
    ...resolveThunk(inputFields),
    clientMutationId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });
  var augmentedPayloadFields = () => ({
    ...resolveThunk(payloadFields),
    clientMutationId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });

  var payloadType = new GraphQLObjectType({
    name: name + 'Payload',
    fields: augmentedPayloadFields
  });

  var inputType = new GraphQLInputObjectType({
    name: name + 'Input',
    fields: augmentedInputFields
  });

  return {
    type: payloadType,
    args: {
      input: {type: new GraphQLNonNull(inputType)}
    },
    resolve: argsCheck(
      args => ({
        input: isObject(args.input)
      }),
      (_, {input}, context, info) => {
        return Promise.resolve(mutateAndGetPayload(input, context, info))
          .then(payload => {
            payload.clientMutationId = input.clientMutationId;
            return payload;
          });
      })
  };
}

const maker = {
  mutation:mutationWithClientMutationId
};

export {
  maker
};

export type {
  MutationConfig,
  mutationFn
};
