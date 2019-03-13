// tslint:disable-next-line:no-var-requires
import { IConfig } from './config.interface';
import { config } from './dotenv.config';

config();

export const Config: IConfig = {
  API_ENDPOINT: process.env.API_ENDPOINT || '',
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID || '',
  ALGOLIA_ADMIN_API_KEY: process.env.ALGOLIA_ADMIN_API_KEY || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  DATA_BACKEND: process.env.DATA_BACKEND || '',
  DATABASE: process.env.DATABASE || '',
  ENV: process.env.ENV || '',
  DB_USER: process.env.DB_USER || '',
  PASSWORD: process.env.PASSWORD || '',
  INSTANCE_CONNECTION_NAME: process.env.INSTANCE_CONNECTION_NAME || '',
  HOST: process.env.HOST || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  UNIVERSAL_LINK_SCHEME: process.env.UNIVERSAL_LINK_SCHEME || '',
  HORIZON_URL: process.env.HORIZON_URL || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_CONNECT_CLIENT_ID: process.env.STRIPE_CONNECT_CLIENT_ID || '',
  STRIPE_PLAN_ID: process.env.STRIPE_PLAN_ID || '',
  ISSUER_ID: process.env.ISSUER_ID || '',
  ISSUER_SEED: process.env.ISSUER_SEED || '',
  YOUTUBE_API_CLIENT_SECRET: process.env.YOUTUBE_API_CLIENT_SECRET || '',
  YOUTUBE_API_CLIENT_ID: process.env.YOUTUBE_API_CLIENT_ID || '',
  YOUTUBE_API_ACCESS_TOKEN: process.env.YOUTUBE_API_ACCESS_TOKEN || '',
  YOUTUBE_API_REFRESH_TOKEN: process.env.YOUTUBE_API_REFRESH_TOKEN || '',
};
