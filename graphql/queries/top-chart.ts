import { GraphQLList } from 'graphql';
import Entry from '../types/entry';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';
import * as Sequelize from 'sequelize';
const { QueryTypes } = Sequelize;

const TopChart = {
  type: new GraphQLList(Entry),
  async resolve(root: any, args: any, ctx: any) {
    await getAuthenticatedUser(ctx);

    return await Database.query(
      `select entries.*, count(*) as "likeCount"
       from "entryLikes"
       inner join entries on entries.id = "entryLikes"."entryId"
       group by "entryId", entries.id
       order by "likeCount" desc limit 40;`,
      { type: QueryTypes.SELECT }
    );
  },
};

export default TopChart;
