import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';

const likeEntry = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    like: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  async resolve(_: any, { id, like }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    if (like) {
      return user.addEntryLike(id);
    }
    return user.removeEntryLike(id);
  }
};

export default likeEntry;
