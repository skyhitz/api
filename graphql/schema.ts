import { GraphQLSchema } from 'graphql';
import Query from './queries/query';
import Mutation from './mutations/mutation';

export const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
