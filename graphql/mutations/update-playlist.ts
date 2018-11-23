import Database from '../../database';
import { GraphQLString } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { PlaylistAttribute } from '../../models/playlist';
import UniqueIdGenerator from '../../auth/unique-id-generator';

type PlaylistAction = 'add' | 'remove' | 'update';

async function create(playlistPayload: PlaylistAttribute, user: any): Promise<string> {
  const playlist = await Database.models.playlist.create(playlistPayload);
  await user.addUserPlaylist(playlist.id);
  return playlist.id;
}

async function triggerAction(playlistId: string, entries: string[], user: any, action: PlaylistAction): Promise<string> {
  if (!playlistId) {
    throw 'missing playlist id.';
  }
  const playlist = await Database.models.playlist.findOne({ where: { id: playlistId } });
  if (!playlist) {
    throw 'could not find playlist';
  }
  const collaborators = await playlist.getCollaborators();
  const isCollaborator = collaborators.find((collaborator: any) => collaborator.id === user.id);
  if (!isCollaborator) {
    throw 'user is not a collaborator in this playlist';
  }

  switch (action) {
    case 'add':
      await playlist.addPlaylistEntries(entries);
      return playlist.id;
    case 'remove':
      await playlist.removePlaylistEntries(entries);
      return playlist.id;
    case 'update':
      await playlist.setPlaylistEntries(entries);
      return playlist.id;
    default:
      throw 'action not specified';
  }
}

const updatePlaylist = {
  type: GraphQLString,
  args: {
    photoUrl: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    action: {
      type: GraphQLString
    },
    id: {
      type: GraphQLString
    },
    ids: {
      type: GraphQLString
    },
  },
  async resolve(_: any, { photoUrl, title, description, action, id, ids }: any, ctx: any) {
    const user = await getAuthenticatedUser(ctx);
    const playlistPayload: PlaylistAttribute = {
      photoUrl: photoUrl,
      title: title,
      id: UniqueIdGenerator.generate(),
      description: description
    };

    try {
      if (!id) {
        return create(playlistPayload, user);
      }
      const entries = ids.split(',');
      return triggerAction(id, entries, user, action);
    } catch (e) {
      return `could not create playlist, ${e}`;
    }
  }
};

export default updatePlaylist;
