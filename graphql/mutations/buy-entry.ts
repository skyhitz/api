import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Database from '../../database';
import { getAuthenticatedUser } from '../../auth/logic';
import { findCustomer, createCustomerWithEmail } from '../../payments/stripe';
import {
  accountCredits,
  payment,
  createAndFundAccount,
  allowTrust,
} from '../../payments/stellar';
import { partialUpdateObject } from '../../algolia/algolia';

async function customerInfo(user: any) {
  let customer = await findCustomer(user.email);
  let credits = await accountCredits(customer.metadata.publicAddress);
  let userSeed = customer.metadata.seed;
  return { credits, userSeed };
}

async function checkIfEntryOwnerHasStripeAccount(email: string) {
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

const buyEntry = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(_: any, args: any, ctx: any) {
    let { id } = args;
    let user = await getAuthenticatedUser(ctx);

    let [{ credits, userSeed }, entry] = [
      await customerInfo(user),
      await Database.models.entry.findOne({
        where: { id: id },
        include: [{ model: Database.models.user, as: 'EntryOwner' }],
      }),
    ];
    let entryOwner;

    if (
      entry.EntryOwner &&
      entry.EntryOwner[0] &&
      entry.EntryOwner[0].dataValues
    ) {
      entryOwner = entry.EntryOwner[0].dataValues;
    } else {
      throw 'no entry owner';
    }

    let publicAddress = await checkIfEntryOwnerHasStripeAccount(entryOwner);

    if (credits >= entry.price) {
      // send payment from buyer to owner of entry
      try {
        let transactionRecord = await payment(
          publicAddress,
          userSeed,
          entry.price
        );
        console.log(transactionRecord);
      } catch (e) {
        throw 'could not complete transaction';
      }
    }

    // update entry owner to buyer

    entry.forSale = false;
    [
      await entry.removeEntryOwner(entryOwner.id),
      await entry.addEntryOwner(user.id),
      await entry.save(),
      await partialUpdateObject({
        objectID: entry.id,
        forSale: false,
        userUsername: user.username,
      }),
    ];
    return true;
  },
};

export default buyEntry;
