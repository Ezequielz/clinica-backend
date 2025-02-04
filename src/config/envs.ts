import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  POSTGRES_URL: get('POSTGRES_URL').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').asString(),
  POSTGRES_DB: get('POSTGRES_DB').asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').asString(),

  JWT_SEED: get('JWT_SEED').required().asString(),


  PAYPAL_CLIENT_ID: get('PAYPAL_CLIENT_ID').required().asString(),
  PAYPAL_CLIENT_SECRET: get('PAYPAL_CLIENT_SECRET').required().asString(),
  PAYPAL_OAUTH_URL: get('PAYPAL_OAUTH_URL').required().asString(),
  PAYPAL_ORDERS_URL: get('PAYPAL_ORDERS_URL').required().asString(),

  CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').required().asString(),
  CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').required().asString(),
  CLOUDINARY_API_SECRET: get('CLOUDINARY_API_SECRET').required().asString(),

}