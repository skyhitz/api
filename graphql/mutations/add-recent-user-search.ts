import { GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import Database from '../../database';
import { getAuthenticatedUser } from '../../auth/logic';

const addRecentUserSearch = {
  type: GraphQLBoolean,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    let searchedUser = await Database.models.user.findOne({ where: { id: args.id } });
    if (searchedUser) {
      let searches = await Database.models.search.findOne({
        where: { userId: user.id }
      });
      if (searches) {
        let userSearches = searches.recentUserSearches;

        if (!userSearches) {
          userSearches = [];
        }

        if (userSearches.length === 25) {
          userSearches.pop();
        }

        let hasBeenSearched = userSearches.find((id: string) => id === searchedUser.id);

        if (hasBeenSearched) {
          let index = userSearches.indexOf(hasBeenSearched);
          userSearches.splice(index, 1);
        }

        userSearches.unshift(searchedUser.id);

        await searches.update({ recentUserSearches: userSearches },
          { where: { userId: user.id } }
        );
        return true;
      }
      await Database.models.search.upsert({
        recentUserSearches: [searchedUser.id],
        userId: user.id
      });
      return true;
    }
    return false;
  }
};

export default addRecentUserSearch;
