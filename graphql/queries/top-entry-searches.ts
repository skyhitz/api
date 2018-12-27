import { GraphQLList } from 'graphql';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';

const TopEntrySearches = {
  type: new GraphQLList(Entry),
  async resolve(root: any, args: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    return [];
  }
};

export default TopEntrySearches;
