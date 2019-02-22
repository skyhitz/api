import { GraphQLString, GraphQLNonNull } from 'graphql';
import CreditFromUser from '../types/credit-from-user';
import { getAuthenticatedUser } from '../../auth/logic';

const hasCreditFromUser = {
  type: CreditFromUser,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, { id }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    let [entry] = await user.getEntryCredit({ where: { id: id } });

    if (entry && entry.entryCredit) {
      return { credits: entry.entryCredit.credits };
    }

    return {
      credits: 0
    };
  }
};

export default hasCreditFromUser;
