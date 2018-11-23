import User from '../types/user';
import { getAuthenticatedUser } from '../../auth/logic';

const AuthenticatedUser = {
  type: User,
  async resolve(root: any, args: any, ctx: any) {
    let user = await getAuthenticatedUser(ctx);
    return user;
  }
};

export default AuthenticatedUser;