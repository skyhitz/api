import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import Entry from './entry';

const UserPlaylist: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserPlaylists',
  description: 'User Playlists',
  fields: () => ({
    photoUrl: {
      type: GraphQLString,
      description: 'Photo url of playlist',
    },
    title: {
      type: GraphQLString,
      description: 'Title of playlist',
    },
    description: {
      type: GraphQLString,
      description: 'Description of playlist',
    },
    id: {
      type: GraphQLString,
      description: 'Id of playlist',
    },
    PlaylistEntries: {
      type: new GraphQLList(Entry),
      description: 'List of entries in playlist',
    }
  })
});

export default UserPlaylist;

