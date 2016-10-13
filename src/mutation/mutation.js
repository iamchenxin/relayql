/** @flow
 *
 * The GraphQL connections type
**/

import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import type {
  GraphQLFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLFieldConfigMap,
  GraphQLResolveInfo
} from 'graphql';

import {
  resolveThunk,
} from '../def/common.js';

import type {
  ObjectMap,
} from '../def/common.js';

import {
  pro
} from 'flow-dynamic';
const {
  argsCheck,
  isObject
} = pro;

// type mutationFn<T: $NonMaybeType<Object>> =
//   ( (args: Object, ctx: mixed, info: GraphQLResolveInfo) => $NonMaybeType<T>) |
//   ( (args: Object, ctx: mixed, info: GraphQLResolveInfo) =>  Promise<$NonMaybeType<T>>);

type mutationFn =
  (args: Object, ctx: mixed, info: GraphQLResolveInfo) =>
  ObjectMap | Promise< ObjectMap > ;

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
  inputFields: GraphQLInputFieldConfigMap,
  payloadFields: GraphQLFieldConfigMap<TSource, *>,
  mutateAndGetPayload: mutationFn,
};

/**
 * Returns a GraphQLFieldConfig for the mutation described by the
 * provided MutationConfig.
 */
function mutationWithClientMutationId<TSource>(
  config: MutationConfig<TSource>
): GraphQLFieldConfig<TSource, *> {
  const {name, inputFields, payloadFields } = config;
  const mutateAndGetPayload: mutationFn = config.mutateAndGetPayload;
  const augmentedInputFields = () => ({
    ...resolveThunk(inputFields),
    clientMutationId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });
  const augmentedPayloadFields = () => ({
    ...resolveThunk(payloadFields),
    clientMutationId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  });

  const payloadType = new GraphQLObjectType({
    name: name + 'Payload',
    fields: augmentedPayloadFields
  });

  const inputType = new GraphQLInputObjectType({
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

// export
const mutation = {
  maker:mutationWithClientMutationId
};

export {
  mutation,
};

// export type
export type {
  MutationConfig,
  mutationFn
};
