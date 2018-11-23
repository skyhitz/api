import * as Sequelize from 'sequelize';

export interface YoutubePlaylistAttribute {
  channelId: string;
  channelTitle: string;
  description: string;
  id: string;
  publishedAt: string;
  title: string;
  thumbnailUrlDefault: string;
  thumbnailUrlHigh: string;
  thumbnailUrlMedium: string;
}

export interface YoutubePlaylistInstance
  extends Sequelize.Instance<YoutubePlaylistAttribute>,
    YoutubePlaylistAttribute {}

export interface YoutubePlaylistModel
  extends Sequelize.Model<YoutubePlaylistInstance, YoutubePlaylistAttribute> {}

export const YoutubePlaylistType = {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  publishedAt: {
    type: Sequelize.STRING,
    allowNull: false
  },
  channelId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  channelTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  thumbnailUrlDefault: {
    type: Sequelize.STRING,
    allowNull: false
  },
  thumbnailUrlHigh: {
    type: Sequelize.STRING,
    allowNull: false
  },
  thumbnailUrlMedium: {
    type: Sequelize.STRING,
    allowNull: false
  }
};
