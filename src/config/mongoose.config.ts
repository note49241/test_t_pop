import { ConfigService } from '@nestjs/config';

export const MongooseConfig = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    console.log('MONGO_CLIENT_URL:', configService.get('MONGO_CLIENT_URL'));
    return {
      uri: configService.get('MONGO_CLIENT_URL'),
    };
  },
};
