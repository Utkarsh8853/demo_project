import * as dotenv from 'dotenv';


dotenv.config();

export const serverConfig = {
    PORT: Number(process.env.PORT),
    HOST: String(process.env.HOST)
}

export const databaseConfig = {
    USERNAME: String(process.env.DB_USERNAME),
    PASSWORD: "      ",
    DATABASE: String(process.env.DB_DATABASE),
    HOST:String(process.env.DB_HOST),
}

export const redisConfig = {
    HOST: String(process.env.REDIS_HOST),
    PORT: Number(process.env.REDIS_PORT)
}

export const googleConfig = {
    CLIENT_ID: String(process.env.CLIENT_ID),
    CLIENT_SECRET: String(process.env.CLIENT_SECRET),
    CLIENT_REDIRECT_SELLER_URI: String(process.env.CLIENT_REDIRECT_SELLER_URI),
    CLIENT_REDIRECT_ADMIN_URI: String(process.env.CLIENT_REDIRECT_ADMIN_URI),
    CLIENT_REDIRECT_BUYER_URI: String(process.env.CLIENT_REDIRECT_BUYER_URI)
}

export const twilioConfig = ({
    TWILIO_ACCOUNT_SID: String(process.env.TWILIO_ACCOUNT_SID),
    TWILIO_AUTH_TOKEN: String(process.env.TWILIO_AUTH_TOKEN),
    TWILIO_MSG_NO: String(process.env.TWILIO_MSG_NO)
})

export const fbConfig = ({
    FB_ACCOUNT_SID: String(process.env.FB_ACCOUNT_SID),
    FB_AUTH_TOKEN: String(process.env.FB_AUTH_TOKEN),
    FB_REDIRECT_URI: String(process.env.FB_REDIRECT_URI)
})

export const adminConfig = ({
    ADMIN_NAME: String(process.env.ADMIN_NAME),
    ADMIN_PASSWORD:String(process.env.ADMIN_PASSWORD),
    ADMIN_PH_NO: String(process.env.ADMIN_PH_NO),
    ADMIN_EMAIL: String(process.env.ADMIN_EMAIL)
})

export const mongoConfig = {
    MONGODB_URL: String(process.env.MONGODB_URL)
}

export const nodemailerConfig = {
    NODEMAILER_EMAIL: String(process.env.NODEMAILER_EMAIL),
    NODEMAILER_PASSWORD: String(process.env.NODEMAILER_PASSWORD)
}

export const jwtConfig = {
    JWT_TOKEN_CODE: String(process.env.JWT_TOKEN_CODE)
}

export const deliveryConfig = {
    DELIVERY_ACCESS_CODE: String(process.env.DELIVERY_ACCESS_CODE)
} 