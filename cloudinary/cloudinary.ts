/// <reference path="./cloudinary.d.ts" />

import { Config } from '../config/index';

import * as cloud from 'cloudinary';

cloud.config({
  cloud_name: 'skyhitz',
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET
});

export const cloudinary = cloud;
