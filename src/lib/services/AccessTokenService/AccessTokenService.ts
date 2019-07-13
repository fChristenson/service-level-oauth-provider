import { RedisClient } from "redis";
import { IAccessToken } from "./AccessToken";
import { promisify } from "util";

export class AccessTokenService {
  private get: (arg1: string) => Promise<string>;
  private set: (arg1: string, arg2: string) => Promise<unknown>;

  constructor(redisClient: RedisClient) {
    this.set = promisify(redisClient.set).bind(redisClient);
    this.get = promisify(redisClient.get).bind(redisClient);
    this.createAccessToken = this.createAccessToken.bind(this);
    this.findAccessToken = this.findAccessToken.bind(this);
  }

  public createAccessToken(token: IAccessToken) {
    this.set(token.value, JSON.stringify(token));
  }

  public async findAccessToken(tokenValue: string): Promise<IAccessToken|null> {
    const json = await this.get(tokenValue);
    return JSON.parse(json) as IAccessToken;
  }
}
