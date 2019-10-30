import {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { findCustomer } from '../../payments/stripe';
import {
  payUserInXLM,
  accountCredits,
  convertUSDtoXLM,
  withdrawalFromAccount,
} from '../../payments/stellar';

/**
 * Withdraws user balance to external address in XLM
 */
const withdrawToExternalWallet = {
  type: GraphQLBoolean,
  args: {
    address: {
      type: new GraphQLNonNull(GraphQLString),
    },
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  async resolve(_: any, { address, amount }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);

    const { metadata } = await findCustomer(user.email);
    if (!metadata) {
      return false;
    }
    const { seed, publicAddress } = metadata;

    const currentBalance = await accountCredits(publicAddress);

    if (amount > currentBalance) {
      return false;
    }

    // 10%
    const skyhitzFee = amount * 0.1;
    // 3%
    const creditCardFees = amount * 0.03;
    const transactionFees = skyhitzFee + creditCardFees;
    const remainingBalance = amount - transactionFees;
    // 1 SKYHITZ per dollar
    const dollarBalance = remainingBalance * 1;
    const xlmAmount = await convertUSDtoXLM(dollarBalance);
    console.log(`converted ${dollarBalance} USD to ${xlmAmount}`);
    // Withdrawal payment in XLM to the user external wallet
    await withdrawalFromAccount(seed, amount);
    // console.log(`chared for fees ${transactionFees}`);
    try {
      console.log(
        `withdrawal to address ${address}, amount ${xlmAmount.toFixed(6)}`
      );
      await payUserInXLM(address, xlmAmount);
      return true;
    } catch (e) {
      console.log(`error`, e);
      return false;
    }
  },
};

export default withdrawToExternalWallet;
