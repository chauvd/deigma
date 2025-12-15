import { ConfigurationModule } from "@deigma/configuration";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigurationService } from "../configuration/configuration.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService) => ({
        uri: configService.databaseUrl,
      }),
      inject: [ConfigurationService]
    })
  ]
})
export class AppDatabaseModule { };