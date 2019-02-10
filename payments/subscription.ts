import { CustomerPayload } from './types';
import {
  createCustomerAndStartSubscription,
  updateCustomer,
  cancelSubscription
} from './stripe';
import {
  createAndFundAccount,
  mergeAccount,
  sendSubscriptionTokens,
  allowTrust
} from './stellar';

export async function subscribe(customer: CustomerPayload) {
  let keyPair: { secret: string; publicAddress: string };
  let customerId: string;
  try {
    customerId = await createCustomerAndStartSubscription(customer);
    console.log('created customer and started subsription');
  } catch (e) {
    throw e;
  }
  try {
    keyPair = await createAndFundAccount();
    console.log('created and funded stellar account');
  } catch (e) {
    throw e;
  }

  try {
    await allowTrust(keyPair.secret);
    console.log('allowed trust');
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
    console.log('updated stripe customer with stellar info');
  } catch (e) {
    console.error(e);
    throw e;
  }
  try {
    console.log('sending subscription tokens');
    // $3.99 plan gives the user 100 credits
    await sendSubscriptionTokens(keyPair.publicAddress, 100);
  } catch (e) {
    console.error('error sending subscription tokens', e);
    throw e;
  }
}

export async function cancel(email: string) {
  let { seed } = await cancelSubscription(email);
  await mergeAccount(seed);
}
