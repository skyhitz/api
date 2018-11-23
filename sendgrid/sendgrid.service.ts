const sgMail = require('@sendgrid/mail');
import { Config } from '../config';
sgMail.setApiKey(Config.SENDGRID_API_KEY);

type SendGridMessage = {
  to: string,
  from: string,
  subject: string,
  html: string,
};

class SendGridService {
  constructor() { }

  sendEmail(message: SendGridMessage) {
    sgMail.send(message);
  }
}

export const sendGridService = new SendGridService();
