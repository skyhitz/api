import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';
import { findCustomer } from '../../payments/stripe';

const canCreditEntry = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, { id }: any, ctx: any) {
    await getAuthenticatedUser(ctx);

    const match = await Database.models.entry.findOne({
      where: { id: id }
    });

    const [{ email }] = await match.getEntryOwner();
    if (!email) {
      return false;
    }

    const customer = await findCustomer(email);
    return !!customer;
  }
};

export default canCreditEntry;
