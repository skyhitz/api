import fetch from 'node-fetch';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import Database from '../../database';
import User from '../types/user';
import * as jwt from 'jsonwebtoken';
import { Config } from '../../config';
import UniqueIdGenerator from '../../auth/unique-id-generator';

const ConfirmUsernameAndEmail = {
  type: User,
  args: {
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    token: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, { username, email, token }: any, ctx: any) {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`
    );
    const facebookProfile = await response.json();

    if (facebookProfile) {
      let user;
      try {
        user = await Database.models.user.create({
          avatarUrl: `https://res.cloudinary.com/skyhitz/image/facebook/${
            facebookProfile.id
          }.jpg`,
          displayName: facebookProfile.name,
          description: null,
          email: email,
          facebookId: facebookProfile.id,
          reputation: 0,
          password: null,
          username: username,
          id: UniqueIdGenerator.generate(),
          userType: 1,
          version: 1,
          publishedAt: new Date().toISOString(),
          phone: null
        });
      } catch (e) {
        console.log(e);
        if (
          e &&
          e.errors &&
          e.errors[0] &&
          e.errors[0].message === 'username must be unique'
        ) {
          throw 'Username is already taken.';
        }
        if (
          e &&
          e.errors &&
          e.errors[0] &&
          e.errors[0].message === 'email must be unique'
        ) {
          throw 'Email already exists, try signing in.';
        }
        throw 'Could not sign up with facebook.';
      }
      const { id, version } = user;
      const token = jwt.sign({ id, email, version } as any, Config.JWT_SECRET);
      user.jwt = token;
      ctx.user = Promise.resolve(user);
      return user;
    }

    throw 'Could not sign in with facebook.';
  }
};

export default ConfirmUsernameAndEmail;