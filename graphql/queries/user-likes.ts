import { GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import Entry from '../types/entry';

const userLikes = {
  type: new GraphQLList(Entry),
  args: {
    limit: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    offset: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve(_: any, { limit, offset }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    return user.getEntryLike({ limit: limit, offset: offset});
  }
};

export default userLikes;
