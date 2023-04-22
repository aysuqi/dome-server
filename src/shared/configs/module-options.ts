import { ConfigModuleOptions } from '@nestjs/config';
import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
};
