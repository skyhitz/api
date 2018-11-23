import * as Sequelize from 'sequelize';
import { Config } from '../config';

import {
  EntryInstance,
  EntryAttribute,
  EntryType,
  UserInstance,
  UserAttribute,
  UserType,
  TopicInstance,
  TopicAttribute,
  TopicType,
  YoutubePlaylistAttribute,
  YoutubePlaylistInstance,
  YoutubePlaylistType,
  PlaylistAttribute,
  PlaylistInstance,
  PlaylistType,
  PlaylistEntryAttribute,
  PlaylistEntryInstance,
  PlaylistEntryType,
  UserPlaylistAttribute,
  UserPlaylistInstance,
  UserPlaylistType,
  SearchInstance,
  SearchAttribute,
  SearchType,
  EntryLikeInstance,
  EntryLikeAttribute,
  EntryLikeType,
  EntryOwnerInstance,
  EntryOwnerAttribute,
  EntryOwnerType
} from '../models';

const poolOptions: any = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
  handleDisconnects: true
};

const databaseOptions: any = {
  dialect: 'postgres',
  host: Config.HOST,
  logging: false,
  pool: poolOptions,
  operatorsAliases: false
};

const Database = new Sequelize(
  Config.DATABASE,
  Config.DB_USER,
  Config.PASSWORD,
  databaseOptions
);

const Entry = Database.define<EntryInstance, EntryAttribute>(
  'entry',
  EntryType
);
const User = Database.define<UserInstance, UserAttribute>('user', UserType);
Database.define<TopicInstance, TopicAttribute>('topic', TopicType);
Database.define<YoutubePlaylistInstance, YoutubePlaylistAttribute>(
  'youtubePlaylist',
  YoutubePlaylistType
);
Database.define<SearchInstance, SearchAttribute>('search', SearchType);
const EntryLike = Database.define<EntryLikeInstance, EntryLikeAttribute>(
  'entryLike',
  EntryLikeType
);
const EntryOwner = Database.define<EntryOwnerInstance, EntryOwnerAttribute>(
  'entryOwner',
  EntryOwnerType
);
const UserPlaylist = Database.define<
  UserPlaylistInstance,
  UserPlaylistAttribute
>('userPlaylist', UserPlaylistType);
const Playlist = Database.define<PlaylistInstance, PlaylistAttribute>(
  'playlist',
  PlaylistType
);
const PlaylistEntry = Database.define<
  PlaylistEntryInstance,
  PlaylistEntryAttribute
>('playlistEntry', PlaylistEntryType);

Entry.belongsToMany(User, { as: 'EntryLike', through: EntryLike });
User.belongsToMany(Entry, { as: 'EntryLike', through: EntryLike });
Entry.belongsToMany(User, { as: 'EntryOwner', through: EntryOwner });

Playlist.belongsToMany(User, { as: 'Collaborators', through: UserPlaylist });
User.belongsToMany(Playlist, { as: 'UserPlaylists', through: UserPlaylist });
Playlist.belongsToMany(Entry, {
  as: 'PlaylistEntries',
  through: PlaylistEntry
});

Database.sync().catch((e: any) => console.error(e));

export default Database;
