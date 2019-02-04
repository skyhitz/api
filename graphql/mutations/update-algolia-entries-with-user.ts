import { GraphQLBoolean } from 'graphql';
import { getAuthenticatedUser } from '../../auth/logic';
import { entriesIndex } from '../../algolia/algolia';
import { entriesToAlgoliaEntries } from '../../parser/parser';

const updateAlgoliaEntriesWithUser = {
  type: GraphQLBoolean,
  async resolve(_: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    let userEntries = await user.getEntryOwner({ limit: 500, offset: 0 });
    let algoliaObjects = entriesToAlgoliaEntries(userEntries, user);
    entriesIndex.partialUpdateObjects(
      algoliaObjects,
      (err: any, content: any) => {
        if (err) throw err;
        console.log(content);
      }
    );
    return true;
  }
};

export default updateAlgoliaEntriesWithUser;
