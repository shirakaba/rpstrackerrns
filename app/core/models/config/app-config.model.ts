import { LoggingLevelEnum } from '~/core/models/enums';

export interface AppConfig {
  apiEndpoint: string;
  loggingEnabled: boolean;
  loggingLevel: LoggingLevelEnum;
}
