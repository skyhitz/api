import * as Sequelize from 'sequelize';

export interface EntryCreditAttribute {}

export interface EntryCreditInstance
  extends Sequelize.Instance<EntryCreditAttribute>,
    EntryCreditAttribute {}

export interface EntryCreditModel
  extends Sequelize.Model<EntryCreditInstance, EntryCreditAttribute> {}

export const EntryCreditType = {
  credits: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
};
