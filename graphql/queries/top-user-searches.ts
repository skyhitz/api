import { GraphQLList } from 'graphql';
import Database from '../../database';
import PublicUser from '../types/public-user';
import { getAuthenticatedUser } from '../../auth/logic';

const TopUserSearches = {
  type: new GraphQLList(PublicUser),
  async resolve(root: any, args: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    return Database.models.user.findAll({
      limit: 5,
      order: [['reputation', 'DESC']]
    });
  }
};

export default TopUserSearches;
