import * as Sequelize from 'sequelize';

export interface TopicAttribute {
  channelId: string;
  channelTitle: string;
  description: string;
  thumbnailUrlDefault: string;
  thumbnailUrlHigh: string;
  thumbnailUrlMedium: string;
}

export interface TopicInstance extends Sequelize.Instance<TopicAttribute>, TopicAttribute { }

export interface TopicModel extends Sequelize.Model<TopicInstance, TopicAttribute> { }

export const TopicType = {
  channelId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  channelTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
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

