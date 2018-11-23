import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import Database from '../../database';
import * as jwt from 'jsonwebtoken';
import User from '../types/user';
import { Config } from '../../config';
import { sendGridService } from '../../sendgrid/sendgrid.service';
import { generateHash } from '../../auth/bycrypt';
const { Op }: any = require('sequelize');

const updatePassword = {
  type: User,
  args: {
    token: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  async resolve(_: any, args: any, ctx: any) {
    let user = await Database.models.user
      .findOne({
        where: {
          resetPasswordToken: args.token,
          resetPasswordExpires: { [Op.gt]: Date.now() }
        }
      });
    if (!user) {
      throw 'Password reset token is invalid or has expired.';
    }

    let passwordHash = await generateHash(args.password);
    user.password = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.version = user.version + 1;
    await user.save();

    const msg = {
      to: user.email,
      from: 'alejandro@skyhitzmusic.com',
      subject: 'Your password has been changed',
      html: `<p>Hi ${user.displayName}, <br><br>This is a confirmation that the password for your Skyhitz account ${user.email} has just been changed.</p>`
    };
    sendGridService.sendEmail(msg);

    const { id, email, version } = user;
    const token = jwt.sign({ id, email, version } as any, Config.JWT_SECRET);
    user.jwt = token;
    ctx.user = Promise.resolve(user);
    return user;
  }
};

export default updatePassword;
