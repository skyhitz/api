import { GraphQLList } from 'graphql';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';

const RecentlyAdded = {
  type: new GraphQLList(Entry),
  async resolve(root: any, args: any, ctx: any) {
    await getAuthenticatedUser(ctx);

    let entries = await Database.models.entry.findAll({
      limit: 25,
      order: [['publishedAt', 'DESC']],
      include: [{ model: Database.models.user, as: 'EntryOwner' }],
    });
    return entries;
  },
};

export default RecentlyAdded;
