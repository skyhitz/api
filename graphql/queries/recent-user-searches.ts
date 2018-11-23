import { GraphQLList } from 'graphql';
import User from '../types/user';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';

const RecentUserSearches = {
  type: new GraphQLList(User),
  async resolve(root: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    let { recentUserSearches } = await Database.models.search.findOne({
      where: { userId: user.id }
    });
    return await Database.models.user.findAll({ limit: 25, where: { id: recentUserSearches } });
  }
};

export default RecentUserSearches;