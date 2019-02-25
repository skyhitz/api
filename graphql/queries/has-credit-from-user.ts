import { GraphQLString, GraphQLNonNull } from 'graphql';
import CreditFromUser from '../types/credit-from-user';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';

const hasCreditFromUser = {
  type: CreditFromUser,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, { id }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);

    // select SUM (credits) AS "totalCredits" from "entryCredits" where "entryId" = '-LYySE3snPZE6GL49UaM';
    const [[entry], totalCredits] = [
      await user.getEntryCredit({ where: { id: id } }),
      await Database.query(
        `select SUM (credits) AS "totalCredits" from "entryCredits" where "entryId" = '${id}'`,
        { type: Database.QueryTypes.SELECT }
      )
    ];

    console.log(totalCredits);

    if (entry && entry.entryCredit) {
      return { credits: entry.entryCredit.credits, totalCredits: totalCredits };
    }
    return {
      credits: 0,
      totalCredits: totalCredits
    };
  }
};

export default hasCreditFromUser;
