import { Config } from '../config/index';

export let cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'skyhitz',
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET
});
