import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import Database from '../../database';
import { getAuthenticatedUser } from '../../auth/logic';

const addRecentEntrySearch = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    let entry = await Database.models.entry.findOne({ where: { id: args.id } });
    if (entry) {
      let userSearches = await Database.models.search.findOne({
        where: { userId: user.id }
      });

      if (userSearches) {
        let entrySearches = userSearches.recentEntrySearches;

        if (!entrySearches) {
          entrySearches = [];
        }

        if (entrySearches.length === 25) {
          entrySearches.pop();
        }

        let hasBeenSearched = entrySearches.find((id: string) => id === entry.id);

        if (hasBeenSearched) {
          let index = entrySearches.indexOf(hasBeenSearched);
          entrySearches.splice(index, 1);
        }

        entrySearches.unshift(entry.id);

        await userSearches.update({ recentEntrySearches: entrySearches },
          { where: { userId: user.id } }
        );
        return true;
      }
      await Database.models.search.upsert({
        recentEntrySearches: [entry.id],
        userId: user.id
      });
      return true;
    }
    return false;
  }
};

export default addRecentEntrySearch;
