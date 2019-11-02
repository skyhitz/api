import { CustomerPayload } from './types';
import {
  updateCustomer,
  cancelSubscription,
  createOrFindCustomer,
  startSubscription,
  findCustomer,
  createCustomerWithEmail,
} from './stripe';
import { createAndFundAccount, mergeAccount, allowTrust } from './stellar';

export async function subscribe(customer: CustomerPayload) {
  let keyPair: { secret: string; publicAddress: string };
  let customerId: string;
  try {
    customerId = await createOrFindCustomer(customer);
    console.log('created customer');
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
    console.log('allowing trust');
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
      seed: keyPair.secret,
    });
    console.log('updated stripe customer with stellar info');
  } catch (e) {
    console.error(e);
    throw e;
  }

  try {
    await startSubscription(customerId);
    console.log('started subscription', customerId);
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function cancel(email: string) {
  let { seed } = await cancelSubscription(email);
  await mergeAccount(seed);
}

export async function checkIfEntryOwnerHasStripeAccount(email: string) {
  let entryOwnerCustomer = await findCustomer(email);

  if (!entryOwnerCustomer) {
    let newCustomer;
    let keyPairNewAcct;
    try {
      keyPairNewAcct = await createAndFundAccount();
    } catch (e) {
      throw 'could not create and fund stellar account';
    }
    try {
      let [, newCus] = [
        await allowTrust(keyPairNewAcct.secret),
        await createCustomerWithEmail(
          email,
          keyPairNewAcct.publicAddress,
          keyPairNewAcct.secret
        ),
      ];
      newCustomer = newCus;
    } catch (e) {
      throw 'could not create stripe customer';
    }
    return newCustomer.metadata.publicAddress;
  }

  let { metadata } = entryOwnerCustomer;
  let { publicAddress } = metadata;
  return publicAddress;
}
