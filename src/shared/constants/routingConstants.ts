export enum CHAT_ROUTES {
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
  IMAGE = "/chat/image",

  PRICING = "/chat/pricing",
  PRICING_SUCCESS = "/chat/pricing/success",
  PRICING_CANCEL = "/chat/pricing/cancel",

  SETTINGS = "/chat/setting",
}

export enum PLATFORM_ROUTES {
  HOME = "/platform",
  NOT_FOUND = "/platform/not-found",
  PLAYGROUND = "/platform/playground",
  ADMIN = "/platform/admin",
  TEAM_MEMBERS = "/platform/team-members",
  API_KEYS = "/platform/api-keys",
  MODELS = "/platform/models",
  PROJECTS = "/platform/projects",
  ENDPOINTS = "/platform/endpoints",
  SETTINGS = "/platform/settings",
  BILLING = "/platform/billing",
  WALLET = "/platform/wallet",
  DASHBOARD = "/platform/dashboard",
}
