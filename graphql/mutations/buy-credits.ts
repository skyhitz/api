import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { buyCreditsWithCard } from '../../payments/subscription';

const buyCredits = {
  type: GraphQLString,
  args: {
    cardToken: {
      type: new GraphQLNonNull(GraphQLString),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  async resolve(_: any, { cardToken, amount }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    await buyCreditsWithCard({
      email: user.email,
      cardToken: cardToken,
      amount: amount,
    });
    return 'successfully bought credits';
  },
};

export default buyCredits;
