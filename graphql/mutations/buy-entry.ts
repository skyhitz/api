import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Database from '../../database';
import { getAuthenticatedUser } from '../../auth/logic';
import { findCustomer } from '../../payments/stripe';
import { accountCredits, payment } from '../../payments/stellar';
import { partialUpdateObject } from '../../algolia/algolia';

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
    let customer = await findCustomer(user.email);
    let credits = await accountCredits(customer.metadata.publicAddress);
    let userSeed = customer.metadata.seed;
    let entry = await Database.models.entry.findOne({
      where: { id: id },
      include: [{ model: Database.models.user, as: 'EntryOwner' }],
    });
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

    let entryOwnerCustomer = await findCustomer(entryOwner.email);
    let { metadata } = entryOwnerCustomer;
    let { publicAddress } = metadata;

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
      await entry.setEntryOwners([user.id]),
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
