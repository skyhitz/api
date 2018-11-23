import {
  GraphQLUnionType
} from 'graphql';
import User from './user';
import UsernameAndEmail from './username-and-email';


let SignInFacebookType = new GraphQLUnionType({
  name: 'SignInFacebook',
  types: [ User, UsernameAndEmail ],
  resolveType(value) {
    if (value.id) {
      return User;
    }
    return UsernameAndEmail;
  }
});

export default SignInFacebookType;

