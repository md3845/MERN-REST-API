import {v2 as cloudinary} from 'cloudinary';
import { Config } from './Config.js';
          
   cloudinary.config({ 
  cloud_name: Config.cloud_name, 
  api_key: Config.api_key, 
  api_secret: Config.secret_key 
});
export default cloudinary;

