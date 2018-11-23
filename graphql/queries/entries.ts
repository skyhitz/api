import { GraphQLList, GraphQLString } from 'graphql';
import Database from '../../database';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';

const Entries = {
  type: new GraphQLList(Entry),
  args: {
    id: {
      type: GraphQLString
    },
    userId: {
      type: GraphQLString
    },
    search: {
      type: GraphQLString
    }
  },
  async resolve(root: any, args: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    if (args.search) {
      return;
    }
    return Database.models.entry.findAll({ where: args });
  }
};

export default Entries;
