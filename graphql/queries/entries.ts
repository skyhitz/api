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
    }
  },
  async resolve(root: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    if (args.userId === user.id) {
      return user.getEntryOwner({ limit: 500, offset: 0 });
    }
    return Database.models.entry.findAll({ where: args });
  }
};

export default Entries;
