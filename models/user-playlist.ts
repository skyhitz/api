import * as Sequelize from 'sequelize';

export interface UserPlaylistAttribute {
}

export interface UserPlaylistInstance extends Sequelize.Instance<UserPlaylistAttribute>, UserPlaylistAttribute { }

export interface UserPlaylistModel extends Sequelize.Model<UserPlaylistInstance, UserPlaylistAttribute> { }

export const UserPlaylistType = {
};

