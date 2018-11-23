import { GraphQLString, GraphQLNonNull } from 'graphql';
const { Op }: any = require('sequelize');
import Database from '../../database';
import User from '../types/user';
import { validPassword } from '../../auth/bycrypt';
import * as jwt from 'jsonwebtoken';
import { Config } from '../../config';

const SignIn = {
  type: User,
  args: {
    usernameOrEmail: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, { usernameOrEmail, password }: any, ctx: any) {
    let user = await Database.models.user.findOne({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.eq]: usernameOrEmail
            }
          },
          {
            email: {
              [Op.eq]: usernameOrEmail
            }
          }
        ]
      }
    } as any);
    if (!user) {
      throw 'Sorry, your username or email does not exist. Sign up to create an account.';
    }
    let valid = await validPassword(password, user.password);
    if (valid) {
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        version: user.version,
      } as any, Config.JWT_SECRET);
      user.jwt = token;
      ctx.user = Promise.resolve(user);
      return user;
    }
    throw 'Incorrect password.';
  }
};

export default SignIn;
