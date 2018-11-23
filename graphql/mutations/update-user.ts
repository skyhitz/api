import { GraphQLString } from 'graphql';
import User from '../types/user';
import { getAuthenticatedUser } from '../../auth/logic';

const updateUser = {
  type: User,
  args: {
    avatarUrl: {
      type: GraphQLString
    },
    displayName: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    phone: {
      type: GraphQLString
    }
  },
  async resolve(_: any, { avatarUrl, displayName, description, username, email, phone }: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    if (user.avatarUrl === 'null') {
      user.avatarUrl = null;
    } else {
      user.avatarUrl = avatarUrl;
    }
    user.displayName = displayName;
    user.description = description;
    user.username = username;
    user.email = email;
    user.phone = phone;
    await user.save();
    return user;
  }
};

export default updateUser;
