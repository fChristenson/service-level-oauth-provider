import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { accessTokenService } from "./lib/services";
import { IAccessTokenRequest, AccessToken, AccessTokenResponse } from "./lib/services/AccessTokenService/AccessToken";
import { users } from "./lib/constants/users";
import { hasScope } from "./lib/middleware/hasScope";

export const app = express();

/**
 * The client signs the JWT with their private key and we use our public one to
 * verify it, this is how we can trust that the client sent the request.
 * 
 * In a real system we would create a database record and store the clientId with
 * this public key so we could be sure that the client that is sending the request
 * is who they say they are because if they are not the keys won't match and the
 * token can not be verified.
 */
const publicKey = fs.readFileSync(path.join(__dirname, "../public.pem"));

app.use(express.json());

/**
 * We are using JWT's for the token request because it adds another layer of security.
 * 
 * JWT's are perfect for this sort of thing, where we want to make sure that a request
 * has not been tampered with and that it comes from a trusted client.
 * 
 * If the verification fails we know someone has changed the original message in the JWT
 * and if the key can't be used to verify we know someone has signed the JWT with another
 * key.
 */
app.get("/api/v1/auth/token", async (req: Request, res: Response) => {
  const jwtToken = jwt.verify(req.query.claim, publicKey) as IAccessTokenRequest;
  const accessToken = AccessToken(jwtToken.clientId, jwtToken.scope);

  await accessTokenService.createAccessToken(accessToken);

  res.json(AccessTokenResponse(accessToken.value));
});

// Oauth secured routes
app.get("/api/v1/users", hasScope("users"), (_: Request, res: Response) => {
  res.json(users);
});

app.get("/api/v1/users/:userId", hasScope("users", ":userId"), (req: Request, res: Response) => {
  res.json(users.find(u => u.id == req.params.userId));
});

app.delete("/api/v1/users/:userId", hasScope("users", ":userId", "delete_user"), (req: Request, res: Response) => {
  // Delete user
  res.json({msg: "Deleted", user: users.find(u => u.id == req.params.userId)});
});
