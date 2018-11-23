import * as Sequelize from 'sequelize';

export interface SearchAttribute {
  userId: string;
  recentEntrySearches: string [];
  recentUserSearches: string [];
}

export interface SearchInstance extends Sequelize.Instance<SearchAttribute>, SearchAttribute { }

export interface SearchModel extends Sequelize.Model<SearchInstance, SearchAttribute> { }

export const SearchType = {
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  recentEntrySearches: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  recentUserSearches: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
};

