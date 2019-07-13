import crypto from "crypto";
export type ClientId = string;
export type Scope = string;
export type AccessTokenValue = string;

const TTL = 3600;

export interface IAccessToken {
  scope: Scope;
  clientId: ClientId;
  ttlInSeconds: number;
  createdAt: Date;
  value: AccessTokenValue;
}

export const AccessToken = (clientId: ClientId, scope: Scope) => {
  return {
    ttlInSeconds: TTL,
    createdAt: new Date(),
    value: crypto.randomBytes(128).toString("base64"),
    clientId,
    scope
  }
}

export interface IAccessTokenResponse {
  ttlInSeconds: number;
  type: "Bearer";
  accessToken: AccessTokenValue;
}

export const AccessTokenResponse = (accessToken: AccessTokenValue) => {
  return {
    ttlInSeconds: TTL,
    type: "Bearer",
    accessToken
  }
}

export interface IAccessTokenRequest {
  clientId: ClientId;
  scope: Scope;
}
