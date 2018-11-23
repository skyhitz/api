import { Express } from 'express';
import * as Stripe from 'stripe';
import { Config } from '../config';
import { sendSubscriptionTokens } from '../payments/stellar';
import { findCustomer } from '../payments/stripe';

export function webhooks(graphQLServer: Express) {
  graphQLServer.post('/stripe/webhooks', async (request, response) => {
    const event: Stripe.webhooks.StripeWebhookEvent<any> = JSON.parse(
      request.body
    );
    switch (event.type) {
      case 'charge.succeeded':
        processChargeSucceeded(event.data, response);
      case 'customer.subscription.created':
        processSubscriptionCreated(event.data, response);
    }
  });
}

async function processChargeSucceeded(object: any, response: any) {
  const { amount, customer } = object;
  const { metadata } = await findCustomer(customer);
  const { publicAddress } = metadata;
  await sendSubscriptionTokens(publicAddress, amount);
  response.send(200);
}

async function processSubscriptionCreated(object: any, response: any) {
  const { customer } = object;
  const { metadata, subscriptions } = await findCustomer(customer);
  const { publicAddress } = metadata;
  const { data } = subscriptions;
  const subscription = data.find(sub => sub.plan.id === Config.STRIPE_PLAN_ID);
  const { plan } = subscription;
  if (subscription.status === 'trialing') {
    const freeTrialTokens = plan.amount / (plan.amount / 100);
    await sendSubscriptionTokens(publicAddress, freeTrialTokens);
  }
  response.send(200);
}
