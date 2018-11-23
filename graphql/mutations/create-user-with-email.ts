import { GraphQLString, GraphQLNonNull } from 'graphql';

import Database from '../../database';
import User from '../types/user';
import UniqueIdGenerator from '../../auth/unique-id-generator';
import { generateHash } from '../../auth/bycrypt';
import * as jwt from 'jsonwebtoken';
import { Config } from '../../config';

const createUserWithEmail = {
  type: User,
  args: {
    displayName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    username: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_: any, args: any, ctx: any) {
    let passwordHash = await generateHash(args.password);
    let user = await Database.models.user.create({
      avatarUrl: null,
      displayName: args.displayName,
      description: null,
      email: args.email,
      reputation: 0,
      password: passwordHash,
      username: args.username,
      id: UniqueIdGenerator.generate(),
      userType: 1,
      version: 1,
      publishedAt: new Date().toISOString(),
      phone: null
    });
    const { id, email, version } = user;
    const token = jwt.sign({ id, email, version } as any, Config.JWT_SECRET);
    user.jwt = token;
    ctx.user = Promise.resolve(user);
    return user;
  }
};

export default createUserWithEmail;