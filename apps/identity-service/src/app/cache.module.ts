import { ConfigurationModule } from "@deigma/configuration";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigurationService } from "../configuration/configuration.service";
import KeyvRedis from "@keyv/redis";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService) => {
        return {
          stores: [
            new KeyvRedis(
              configService.redisUrl,
              {
                namespace: configService.redisNamespace,
                keyPrefixSeparator: configService.redisKeyPrefixSeparator
              }
            ),
          ],
          isGlobal: true,
        };
      },
      inject: [ConfigurationService],
    })
  ],
  exports: [CacheModule],
})
export class AppCacheModule { }