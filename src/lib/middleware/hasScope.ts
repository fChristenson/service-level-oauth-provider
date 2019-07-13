import { Request, Response, NextFunction } from "express";
import { Scope, AccessTokenValue } from "../services/AccessTokenService/AccessToken";
import { accessTokenService } from "../services";

export const hasScope = (...scopes: Scope[]) => async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({msg: "Missing accessToken"});
  }
  
  const tokenValue = auth.split(" ")[1] as AccessTokenValue;
  const token = await accessTokenService.findAccessToken(tokenValue);

  if(!token) {
    return res.status(404).json({msg: "No token found"});
  }

  const tokenScopes = token.scope.split(" ");
  const hasScope = scopes
    .filter(scope => !isTemplate(scope))
    .every(scope => tokenScopes.includes(scope));

  const canAccessResource = scopes.every((scope, i, self) => {
    if(!isTemplate(scope)) return true;
    const resourceName = self[i - 1];
    const resourceIdIndex = tokenScopes.indexOf(resourceName) + 1; // assume <resource> <id>
    const resourceId = tokenScopes[resourceIdIndex];
    const paramId = req.params[scope.replace(":", "")]; // remove ":" so template name matches param

    // if both param id and token id are defined and they are the same
    return (resourceId && paramId) && resourceId === paramId;
  });

  if(hasScope && canAccessResource) {
    return next();
  }

  return res.status(401).json({msg: "Token does not contain needed scope"});
}

const isTemplate = (str: string) => {
  return /^:/.test(str);
};