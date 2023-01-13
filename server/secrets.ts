export const keycloak = {
  client_id: "user",
  client_secret: "jNUkSmPvNVWIcy68nBE1ZYkGp3HdI8aQ", // TODO
  redirect_uris: ["http://127.0.0.1:8095/api/login-callback"],
  post_logout_redirect_uris: [""],
  response_types: ["code"],
};

export const sessionSecret = {
  secret: "secret",
};
