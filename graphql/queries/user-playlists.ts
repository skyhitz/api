import Database from '../../database';
import { GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import UserPlaylist from '../types/user-playlist';

const userPlaylists = {
  type: new GraphQLList(UserPlaylist),
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
    return user.getUserPlaylists({
      limit: limit,
      offset: offset,
      include: [
        { model: Database.models.entry, as: 'PlaylistEntries' }
      ]});
  }
};

export default userPlaylists;
