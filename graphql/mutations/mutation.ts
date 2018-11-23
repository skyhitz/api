import { GraphQLObjectType } from 'graphql';
import CreateUserWithEmail from './create-user-with-email';
import CreateEntry from './create-entry';
import SignIn from './sign-in';
import SendResetEmail from './send-reset-email';
import UpdatePassword from './update-password';
import UpdateUser from './update-user';
import AddRecentEntrySearch from './add-recent-entry-search';
import AddRecentUserSearch from './add-recent-user-search';
import SignInWithFacebook from './sign-in-with-facebook';
import ConfirmUsernameAndEmail from './confirm-username-and-email';
import LikeEntry from './like-entry';
import UpdatePlaylist from './update-playlist';
import RemovePlaylist from './remove-playlist';
import SubscribeUser from './subscribe-user';
import CancelSubscription from './cancel-subscription';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Create users or entries',
  fields() {
    return {
      addRecentEntrySearch: AddRecentEntrySearch,
      addRecentUserSearch: AddRecentUserSearch,
      createUserWithEmail: CreateUserWithEmail,
      createEntry: CreateEntry,
      signIn: SignIn,
      sendResetEmail: SendResetEmail,
      updatePassword: UpdatePassword,
      updateUser: UpdateUser,
      signInWithFacebook: SignInWithFacebook,
      confirmUsernameAndEmail: ConfirmUsernameAndEmail,
      likeEntry: LikeEntry,
      updatePlaylist: UpdatePlaylist,
      removePlaylist: RemovePlaylist,
      subscribeUser: SubscribeUser,
      cancelSubscription: CancelSubscription
    };
  }
});

export default Mutation;