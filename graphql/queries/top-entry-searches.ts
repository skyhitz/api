import { GraphQLList } from 'graphql';
import Database from '../../database';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';
const { Op }: any = require('sequelize');

const TopEntrySearches = {
  type: new GraphQLList(Entry),
  async resolve(root: any, args: any, ctx: any) {
    await getAuthenticatedUser(ctx);
    return Database.models.entry.findAll({
      limit: 5,
      where: {
        viewCount: {
          [Op.gt]: 1000000000
        }
      },
      order: [['viewCount', 'DESC']]
    });
  }
};

export default TopEntrySearches;
