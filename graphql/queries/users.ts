import { GraphQLString, GraphQLList } from 'graphql';

import Database from '../../database';
import PublicUser from '../types/public-user';
import { getAuthenticatedUser } from '../../auth/logic';

type UserArgs = {
  id?: string;
  username?: string;
  displayName?: string;
  search?: string;
};

const Users = {
  type: new GraphQLList(PublicUser),
  args: {
    id: {
      type: GraphQLString
    },
    username: {
      type: GraphQLString
    },
    displayName: {
      type: GraphQLString
    },
    search: {
      type: GraphQLString
    }
  },
  async resolve(root: any, args: UserArgs, ctx: any) {
    await getAuthenticatedUser(ctx);
    if (args.search) {
      return;
    }
    return Database.models.user.findAll({ where: args });
  }
};

export default Users;
