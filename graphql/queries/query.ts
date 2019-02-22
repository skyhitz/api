import { GraphQLObjectType } from 'graphql';

import Users from './users';
import TopUserSearches from './top-user-searches';
import RecentUserSearches from './recent-user-searches';
import Entries from './entries';
import TopEntrySearches from './top-entry-searches';
import RecentEntrySearches from './recent-entry-searches';
import AuthenticatedUser from './authenticated-user';
import UserLikes from './user-likes';
import EntryLikes from './entry-likes';
import UserPlaylists from './user-playlists';
import PaymentsInfo from './payments-info';
import HasCreditFromUser from './has-credit-from-user';

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Get users or entries',
  fields: () => {
    return {
      users: Users,
      topUserSearches: TopUserSearches,
      recentUserSearches: RecentUserSearches,
      entries: Entries,
      topEntrySearches: TopEntrySearches,
      recentEntrySearches: RecentEntrySearches,
      authenticatedUser: AuthenticatedUser,
      userLikes: UserLikes,
      entryLikes: EntryLikes,
      userPlaylists: UserPlaylists,
      paymentsInfo: PaymentsInfo,
      hasCreditFromUser: HasCreditFromUser
    };
  }
});

export default Query;
