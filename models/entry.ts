import * as Sequelize from 'sequelize';

export interface EntryAttribute {
  imageUrl: string;
  etag: string;
  videoUrl: string;
  youtubeId: string;
  description: string;
  title: string;
  id: string;
  publishedAtTimestamp: number;
  publishedAt: string;
  price: number;
  forSale: number;
}

export interface EntryInstance
  extends Sequelize.Instance<EntryAttribute>,
    EntryAttribute {}

export interface EntryModel
  extends Sequelize.Model<EntryInstance, EntryAttribute> {}

export const EntryType = {
  videoUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  youtubeId: {
    type: Sequelize.STRING,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  etag: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  publishedAtTimestamp: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  publishedAt: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.NUMBER,
  },
  forSale: {
    type: Sequelize.BOOLEAN,
  },
};
