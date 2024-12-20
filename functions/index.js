import express from 'express';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import * as crypto from "crypto";
import { https } from 'firebase-functions';
import{ 
  FIREBASE_CLIENT_ID, 
  FIREBASE_ISSUER, 
  OAUTH_SERVER_SECRET, 
  ISSUER_URL, 
  FIREBASE_CALLBACK_URI
}  from "./config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Store authorization codes temporarily
let authorizationCodes = {};
let user_name = 'Karthik';
let user_email = 'rk33345@gmail.com';

// Generate JWT Token
function generateJWT(user) {
  const payload = {
    iss: ISSUER_URL,
    sub: user_email,
    aud: FIREBASE_CLIENT_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    email: user_email,
    name: user_name,
  };
  return jwt.sign(payload, OAUTH_SERVER_SECRET, { algorithm: "HS256" });
}

app.post('/setUser', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Both name and email are required.' });
    }

    // Set the variables
    user_name = name;
    user_email = email;

    res.json({
        message: 'User details updated successfully.',
        user_name,
        user_email
    });
});

// User Info Endpoint
app.get("/userinfo", (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = jwt.verify(
      token.split(" ")[1],
      OAUTH_SERVER_SECRET,
      { algorithms: ["HS256"], audience: FIREBASE_CLIENT_ID }
    );
    console.log("Decoded token:", decodedToken);

    res.json({
      sub: user_email,
      email: user_email,
      name: user_name,
      email_verified: true,
    });
  } catch (error) {
    console.error("Token error:", error.message);
    if (error.name === "TokenExpiredError") return res.status(401).json({ error: "Token expired" });
    res.status(401).json({ error: "Invalid token" });
  }
});

// Authorization Endpoint
app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, state } = req.query;
  console.log("client_id",client_id)
  console.log("FIREBASE_CLIENT_ID",FIREBASE_CLIENT_ID)
  console.log("redirect_uri",redirect_uri)
  console.log("FIREBASE_CALLBACK_URI",FIREBASE_CALLBACK_URI) //doesnt go beyond this
  if (client_id !== FIREBASE_CLIENT_ID || redirect_uri !== FIREBASE_CALLBACK_URI) {
    return res.status(400).json({ error: "invalid_client or invalid_redirect_uri" });
  }
 
  const code = crypto.randomBytes(16).toString("hex");
  authorizationCodes[code] = {
    user_email,
    expires_at: Date.now() + 300000, // 5 minutes
    redirect_uri,
  };
  console.log("/authorize working checkpoint")
  try{
    res.redirect(`${encodeURIComponent(redirect_uri)}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`);
  } catch (error) {
    console.error("/Authorize error:", error);
    res.status(500).send("An error occurred during authorization.");
  }
});

// Token Endpoint
app.post("/token", (req, res) => {
  const { code, client_id, client_secret,redirect_uri } = req.body;

  /*const codeData = authorizationCodes[code];
  if (!codeData) return res.status(400).json({ error: "invalid_grant" });
  if (Date.now() > codeData.expires_at) {
    delete authorizationCodes[code];
    return res.status(400).json({ error: "expired_code" });
  }
  if (redirect_uri !== codeData.redirect_uri) {
    return res.status(400).json({ error: "redirect_uri_mismatch" });
  }*/

  const idToken = generateJWT(user_name);
  const accessTokenPayload = {
    sub: user_email,
    aud: FIREBASE_CLIENT_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: "read write",
  };
  const accessToken = jwt.sign(accessTokenPayload, OAUTH_SERVER_SECRET, { algorithm: "HS256" });

  //delete authorizationCodes[code];

  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    id_token: idToken,
  });
});

// OpenID Configuration Endpoint
app.get("/.well-known/openid-configuration", (req, res) => {
  res.json({
    issuer: ISSUER_URL,
    authorization_endpoint: `${ISSUER_URL}/authorize`,
    token_endpoint: `${ISSUER_URL}/token`,
    jwks_uri: `${ISSUER_URL}/.well-known/jwks.json`,
  });
});

// Token Info Endpoint
app.get("/tokeninfo", (req, res) => {
  const { id_token } = req.query;

  try {
    const decoded = jwt.verify(id_token, OAUTH_SERVER_SECRET, { algorithms: ["HS256"], audience: FIREBASE_CLIENT_ID });
    res.json(decoded);
  } catch (error) {
    if (error.name === "TokenExpiredError") return res.status(401).json({ error: "token_expired" });
    res.status(401).json({ error: "invalid_token" });
  }
});

// Start the server
export const appFunction = https.onRequest(app);