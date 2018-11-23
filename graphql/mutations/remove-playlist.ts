import Database from '../../database';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';

const removePlaylist = {
  type: GraphQLString,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  async resolve(_: any, { id }: any, ctx: any) {
    const user = await getAuthenticatedUser(ctx);

    try {
      if (!id) {
        throw 'missing playlist id.';
      }
      const playlist = await Database.models.playlist.findOne({ where: { id: id } });
      if (!playlist) {
        throw 'could not find playlist';
      }
      const collaborators = await playlist.getCollaborators();
      const isCollaborator = collaborators.find((collaborator: any) => collaborator.id === user.id);
      if (!isCollaborator) {
        throw 'user is not a collaborator in this playlist';
      }

      await playlist.destroy();
      return id;
    } catch (e) {
      return `could not remove playlist, ${e}`;
    }
  }
};

export default removePlaylist;
