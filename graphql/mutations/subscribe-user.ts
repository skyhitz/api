import { GraphQLString } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { subscribe } from '../../payments/subscription';

const subscribeUser = {
  type: GraphQLString,
  args: {
    cardToken: {
      type: GraphQLString
    }
  },
  async resolve(_: any, { cardToken }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    await subscribe({
      email: user.email,
      cardToken: cardToken
    });
    return 'successfully subscribed';
  }
};

export default subscribeUser;
