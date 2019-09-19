import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import Database from '../../database';
import { getAuthenticatedUser } from '../../auth/logic';
import { saveEntryObject } from '../../algolia/algolia';

const updatePricing = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    price: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    forSale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  async resolve(_: any, args: any, ctx: any) {
    let { id, price, forSale } = args;

    let user = await getAuthenticatedUser(ctx);
    let entry = await Database.models.entry.findOne({ where: { id: id } });

    try {
      const result = await entry.getEntryOwner();
      const ownerId = result[0].id;
      if (user.id !== ownerId) {
        return false;
      }
    } catch (e) {
      return false;
    }

    entry.price = price;
    entry.forSale = forSale;
    [
      await entry.save(),
      await saveEntryObject({
        objectID: entry.id,
        price: entry.price,
        forSale: entry.forSale,
      }),
    ];
    return true;
  },
};

export default updatePricing;
