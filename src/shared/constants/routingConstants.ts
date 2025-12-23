export enum APP_ROUTES {
    HOME = "/",
    SIGNUP = "/auth/signup",
    SIGNIN = "/auth/login",
    SIGNOUT = "/auth/logout",
    FORGOT_PASSWORD = "/auth/forgot-password",
    RESET_PASSWORD = "/auth/reset-password",
    VERIFY_EMAIL = "/auth/signup/verify-email",
    OAUTH2SUCESS = "/auth/oauth2-success",
    GOOGLE_SIGNIN = "http://localhost:8080/oauth2/authorization/google",

    PLAYGROUND = "/playground",

    CHAT = "/chat",
    IMAGE = "/chat/image",

    PRICING = "/pricing",
    PRICING_SUCCESS = "/pricing/success",
    PRICING_CANCEL = "/pricing/cancel",

    SETTINGS = "/setting",
}