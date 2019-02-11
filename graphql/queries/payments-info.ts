import { getAuthenticatedUser } from '../../auth/logic';
import { findCustomer } from '../../payments/stripe';
import PaymentsInfoObject from '../types/payments-info';
import { accountCredits } from '../../payments/stellar';

const PaymentsInfo = {
  type: PaymentsInfoObject,
  async resolve(root: any, args: any, ctx: any) {
    let user;
    try {
      user = await getAuthenticatedUser(ctx);
    } catch (e) {
      return {
        subscribed: false,
        credits: 0
      };
    }

    let customer = await findCustomer(user.email);

    if (!!customer) {
      let credits = await accountCredits(customer.metadata.publicAddress);
      return {
        subscribed: true,
        credits: credits
      };
    }
    return {
      subscribed: false,
      credits: 0
    };
  }
};

export default PaymentsInfo;
