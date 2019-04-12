import { Express } from 'express';
import * as Stripe from 'stripe';
import { sendSubscriptionTokens } from '../payments/stellar';
import { findCustomer } from '../payments/stripe';

function stripeWebhook(graphQLServer: Express) {
  graphQLServer.post('/stripe/webhooks', async (request, response) => {
    const event: Stripe.webhooks.StripeWebhookEvent<any> = JSON.parse(
      request.body
    );
    if (event.type === 'charge.succeeded') {
      return processChargeSucceeded(event.data, response);
    }
  });
}

export function webhooks(graphQLServer: Express) {
  stripeWebhook(graphQLServer);
}

async function processChargeSucceeded(object: any, response: any) {
  const { customer } = object;
  const { metadata } = await findCustomer(customer);
  const { publicAddress } = metadata;
  try {
    console.log('sending subscription tokens');
    // $6.99 plan gives the user 100 credits
    await sendSubscriptionTokens(publicAddress, 100);
  } catch (e) {
    console.error('error sending subscription tokens', e);
    throw e;
  }
  response.send(200);
}

// async function processSubscriptionCreated(object: any, response: any) {
//   const { customer } = object;
//   const { metadata, subscriptions } = await findCustomer(customer);
//   const { publicAddress } = metadata;
//   const { data } = subscriptions;
//   const subscription = data.find(sub => sub.plan.id === Config.STRIPE_PLAN_ID);
//   const { plan } = subscription;
//   if (subscription.status === 'trialing') {
//     const freeTrialTokens = plan.amount / (plan.amount / 100);
//     await sendSubscriptionTokens(publicAddress, freeTrialTokens);
//   }
//   response.send(200);
// }
