import { config } from "dotenv";

config();

const _Config={
    port:process.env.PORT,
    databaseUrl:process.env.MONGO_URL,
    env:process.env.NODE_ENV,
    jwtToken:process.env.JWT_TOKEN,
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    secret_key:process.env.CLOUD_SECRET_KEY



}

 export const Config=Object.freeze(_Config)


