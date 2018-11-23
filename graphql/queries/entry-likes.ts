import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import EntryLikes from '../types/entry-likes';
import Database from '../../database';

const entryLikes = {
  type: EntryLikes,
  args: {
    limit: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    offset: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, { limit, offset, id }: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    let entry = await Database.models.entry.findAndCountAll({
      include: [
        { model: Database.models.user, as: 'EntryLike' }
      ],
      where: { id: id },
    });
    return {
      count: entry.count,
      users: entry.rows[0].getEntryLike({limit: limit, offset: offset})
    };
  }
};

export default entryLikes;
