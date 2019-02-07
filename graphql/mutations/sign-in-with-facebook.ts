import fetch from 'node-fetch';
import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import Database from '../../database';
import SignInWithFacebookType from '../types/sign-in-facebook';
import * as jwt from 'jsonwebtoken';
import { Config } from '../../config';
const removeDiacritics = require('diacritics').remove;

function getUsernameFromName(name: string) {
  const usernameCharLimit = 30;
  let displayNameWithoutDiacritics = removeDiacritics(name.toLowerCase());
  let usernameWithoutWhitespaces = displayNameWithoutDiacritics
    .replace(/\W/g, '')
    .replace(/&/g, 'and');
  return usernameWithoutWhitespaces.substring(0, usernameCharLimit);
}

async function getFacebookProfile(token: string) {
  const response = await fetch(
    `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`
  );
  return await response.json();
}

async function getUserWithFacebookId(id: string, testing: boolean) {
  return await Database.models.user.find({
    where: { facebookId: id, testing: testing },
    limit: 1
  } as any);
}

const SignInWithFacebook = {
  type: SignInWithFacebookType,
  args: {
    token: {
      type: new GraphQLNonNull(GraphQLString)
    },
    testing: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  async resolve(_: any, { token, testing }: any, ctx: any) {
    if (!token) {
      throw 'did not send any token';
    }
    const facebookProfile = await getFacebookProfile(token);
    const user = await getUserWithFacebookId(facebookProfile.id, testing);
    if (user) {
      const jwtToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          version: user.version
        } as any,
        Config.JWT_SECRET
      );
      user.jwt = jwtToken;
      ctx.user = Promise.resolve(user);
      return user;
    }

    if (!user && facebookProfile) {
      return {
        username: getUsernameFromName(facebookProfile.name),
        email: facebookProfile.email
      };
    }

    throw 'Could not sign in with facebook';
  }
};

export default SignInWithFacebook;
