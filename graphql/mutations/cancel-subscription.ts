import { GraphQLString } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { cancel } from '../../payments/subscription';

const cancelSubscription = {
  type: GraphQLString,
  async resolve(_: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    await cancel(user.email);
    return 'cancelled subscription sucessfully';
  }
};

export default cancelSubscription;
