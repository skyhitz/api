import { GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { findCustomer } from '../../payments/stripe';

const PaymentsInfo = {
  type: GraphQLBoolean,
  async resolve(root: any, args: any, ctx: any) {
    let user;
    try {
      user = await getAuthenticatedUser(ctx);
    } catch (e) {
      return false;
    }
    let customer = await findCustomer(user.email);
    return !!customer;
  }
};

export default PaymentsInfo;
