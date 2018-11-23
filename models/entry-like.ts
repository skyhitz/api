import * as Sequelize from 'sequelize';

export interface EntryLikeAttribute {
}

export interface EntryLikeInstance extends Sequelize.Instance<EntryLikeAttribute>, EntryLikeAttribute { }

export interface EntryLikeModel extends Sequelize.Model<EntryLikeInstance, EntryLikeAttribute> { }

export const EntryLikeType = {
};

