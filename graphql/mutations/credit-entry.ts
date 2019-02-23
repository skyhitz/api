import {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull
} from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import Database from '../../database';
import { findCustomer } from '../../payments/stripe';
import { payment } from '../../payments/stellar';

const creditEntry = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    credits: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  async resolve(_: any, { id, credits }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);

    // Get owner of entry
    const match = await Database.models.entry.findOne({
      where: { id: id }
    });

    const [{ email }] = await match.getEntryOwner();

    // Get their stellar account address and our account key
    const [accountToCredit, accountToWithdraw] = [
      await findCustomer(email),
      await findCustomer(user.email)
    ];

    const accountToCreditPublicAddress = accountToCredit.metadata.publicAddress;
    const accountToWithdrawSeed = accountToWithdraw.metadata.seed;

    // Transact credits from wallet to wallet
    try {
      await payment(
        accountToCreditPublicAddress,
        accountToWithdrawSeed,
        credits
      );
    } catch (e) {
      return false;
    }

    let [entry] = await user.getEntryCredit({ where: { id: id } });

    if (entry && entry.entryCredit) {
      let addedCredits = credits + entry.entryCredit.credits;
      return user.setEntryCredit(id, { through: { credits: addedCredits } });
    }

    return user.addEntryCredit(id, { through: { credits: credits } });
  }
};

export default creditEntry;
