import * as Sequelize from 'sequelize';

export interface UserAttribute {
  avatarUrl: string;
  bannerUrl: string;
  displayName: string;
  email: string;
  reputation: number;
  publishedAt: string;
  publishedAtTimestamp: number;
  username: string;
  id: string;
  password: string;
  userType: number;
  version: number;
  description: string;
  phone: string;
  testing: boolean;
}

export interface UserInstance
  extends Sequelize.Instance<UserAttribute>,
    UserAttribute {}

export interface UserModel
  extends Sequelize.Model<UserInstance, UserAttribute> {}

export const UserType = {
  avatarUrl: {
    type: Sequelize.STRING
  },
  bannerUrl: {
    type: Sequelize.STRING
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    unique: true
  },
  reputation: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  publishedAt: {
    type: Sequelize.STRING
  },
  publishedAtTimestamp: {
    type: Sequelize.INTEGER
  },
  facebookId: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  resetPasswordToken: {
    type: Sequelize.STRING
  },
  resetPasswordExpires: {
    type: Sequelize.DATE
  },
  password: {
    type: Sequelize.STRING
  },
  userType: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  testing: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  version: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  }
};
