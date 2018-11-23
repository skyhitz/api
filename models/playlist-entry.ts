import * as Sequelize from 'sequelize';

export interface PlaylistEntryAttribute {
}

export interface PlaylistEntryInstance extends Sequelize.Instance<PlaylistEntryAttribute>, PlaylistEntryAttribute { }

export interface PlaylistEntryModel extends Sequelize.Model<PlaylistEntryInstance, PlaylistEntryAttribute> { }

export const PlaylistEntryType = {
};

