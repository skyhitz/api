import * as Sequelize from 'sequelize';

export interface PlaylistAttribute {
  id: string;
  photoUrl: string;
  title: string;
  description: string;
}

export interface PlaylistInstance extends Sequelize.Instance<PlaylistAttribute>, PlaylistAttribute { }

export interface PlaylistModel extends Sequelize.Model<PlaylistInstance, PlaylistAttribute> { }

export const PlaylistType = {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  photoUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
};

