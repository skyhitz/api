import * as Stripe from 'stripe';
import { CustomerPayload, UpdateCustomerPayload } from './types';
import { Config } from '../config';
export const stripe = new Stripe(Config.STRIPE_SECTRET_KEY);

export async function updateCustomer({
  customerId,
  publicAddress,
  seed
}: UpdateCustomerPayload) {
  return stripe.customers.update(customerId, {
    metadata: {
      publicAddress: publicAddress,
      seed: seed
    }
  });
}

export async function createCustomer({ email, cardToken }: CustomerPayload) {
  let customer = await findCustomer(email);
  if (customer && customer.id) {
    throw 'customer already exists';
  }
  return stripe.customers.create({
    email: email,
    source: cardToken
  });
}

export async function findCustomer(email: string) {
  let match = await stripe.customers.list({
    limit: 1,
    email: email
  });

  return match.data ? match.data[0] : null;
}

export async function findSubscription(customerId: string) {
  let match = await stripe.subscriptions.list({
    limit: 1,
    customer: customerId,
    plan: Config.STRIPE_PLAN_ID
  });

  return match.data[0];
}

export async function createCustomerAndStartSubscription({
  email,
  cardToken
}: CustomerPayload) {
  let { id } = await createCustomer({ email, cardToken });
  await stripe.subscriptions.create({
    customer: id,
    items: [
      {
        plan: Config.STRIPE_PLAN_ID
      }
    ]
  });
  return id;
}

export async function cancelSubscription(email: string) {
  let { id, metadata } = await findCustomer(email);
  await stripe.customers.del(id);
  return metadata;
}
