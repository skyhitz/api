import * as Sequelize from 'sequelize';

export interface EntryOwnerAttribute {}

export interface EntryOwnerInstance
  extends Sequelize.Instance<EntryOwnerAttribute>,
    EntryOwnerAttribute {}

export interface EntryOwnerModel
  extends Sequelize.Model<EntryOwnerInstance, EntryOwnerAttribute> {}

export const EntryOwnerType = {};
