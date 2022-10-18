const { google } = require("googleapis");

const clientId = process.env.OAUTH_CLIENTID;
const clientSecret = process.env.OAUTH_CLIENT_SECRET;
const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({ refresh_token: refreshToken });
const accessToken = OAuth2Client.getAccessToken;

module.exports = accessToken;
