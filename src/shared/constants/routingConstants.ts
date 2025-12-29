export enum APP_ROUTES {
  HOME = "/",
  SIGNUP = "/chat/auth/signup",
  SIGNIN = "/chat/auth/login",
  SIGNOUT = "/chat/auth/logout",
  FORGOT_PASSWORD = "/chat/auth/forgot-password",
  RESET_PASSWORD = "/chat/auth/reset-password",
  VERIFY_EMAIL = "/chat/auth/signup/verify-email",
  OAUTH2SUCESS = "/chat/auth/oauth2-success",
  GOOGLE_SIGNIN = "http://localhost:8080/oauth2/authorization/google",

  PLAYGROUND = "/platform/playground",

  CHAT = "/chat",
  PLATFORM = "/platform",

  IMAGE = "/chat/image",

  PRICING = "/chat/pricing",
  PRICING_SUCCESS = "/chat/pricing/success",
  PRICING_CANCEL = "/chat/pricing/cancel",

  SETTINGS = "/chat/setting",
}
