import redis from "redis";
import { AccessTokenService } from "./AccessTokenService/AccessTokenService";
const client = redis.createClient();

export const accessTokenService = new AccessTokenService(client);
