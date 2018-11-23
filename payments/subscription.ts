import { CustomerPayload } from './types';
import {
  createCustomerAndStartSubscription,
  updateCustomer,
  cancelSubscription
} from './stripe';
import { createAndFundAccount, allowTrust, mergeAccount } from './stellar';

export async function subscribe(customer: CustomerPayload) {
  let keyPair: { secret: string; publicAddress: string };
  let customerId: string;
  try {
    customerId = await createCustomerAndStartSubscription(customer);
  } catch (e) {
    throw e;
  }
  try {
    keyPair = await createAndFundAccount();
  } catch (e) {
    throw e;
  }

  try {
    await allowTrust(keyPair.secret);
  } catch (e) {
    console.error(e);
    throw e;
  }

  try {
    await updateCustomer({
      customerId: customerId,
      publicAddress: keyPair.publicAddress,
      seed: keyPair.secret
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function cancel(email: string) {
  let { seed } = await cancelSubscription(email);
  await mergeAccount(seed);
}
