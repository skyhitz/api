import * as Sequelize from 'sequelize';

export interface EntryAttribute {
  imageUrl: string;
  etag: string;
  videoUrl: string;
  description: string;
  likeCount: number;
  title: string;
  id: string;
  viewCount: number;
  points: number;
}

export interface EntryInstance
  extends Sequelize.Instance<EntryAttribute>,
    EntryAttribute {}

export interface EntryModel
  extends Sequelize.Model<EntryInstance, EntryAttribute> {}

export const EntryType = {
  videoUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  etag: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  likeCount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  viewCount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};
