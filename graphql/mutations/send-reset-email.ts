import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';

import Database from '../../database';
const crypto = require('crypto');
import { sendGridService } from '../../sendgrid/sendgrid.service';
import { Config } from '../../config';

const sendResetEmail = {
  type: GraphQLBoolean,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  async resolve(_: any, args: any, ctx: any) {
    let user = await Database.models.user.findOne({ where: { email: args.email }});
    if (!user) {
      throw 'Email not found.';
    }
    let buffer = await crypto.randomBytes(20);
    let token = buffer.toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();
    const msg = {
      to: user.email,
      from: 'alejandro@skyhitzmusic.com',
      subject: 'Skyhitz Password Reset',
      html: `<p>Hi ${user.displayName},
        <br><br><p>You are receiving this email because you have requested the reset of the password for your Skyhitz account.<br>
        Please paste this link into your browser to complete the process:<br><br>
        <strong><a href="${Config.UNIVERSAL_LINK_SCHEME}accounts/update-password/${token}">${Config.UNIVERSAL_LINK_SCHEME}accounts/update-password/${token}</a></strong>
        <br><br>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    };
    sendGridService.sendEmail(msg);
    return true;
  }
};

export default sendResetEmail;
