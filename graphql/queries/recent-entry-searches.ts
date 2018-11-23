import { GraphQLList } from 'graphql';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';

const RecentEntrySearches = {
  type: new GraphQLList(Entry),
  async resolve(root: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    let { recentEntrySearches } = await Database.models.search.findOne({
      where: { userId: user.id }
    });
    return await Database.models.entry.findAll({ limit: 25, where: { id: recentEntrySearches } });
  }
};

export default RecentEntrySearches;
