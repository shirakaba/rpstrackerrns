import { AppConfig } from '~/core/models/config/app-config.model';

type ProjEnv = 'Dev' | 'Prod';

const env: ProjEnv = 'Dev';

export let appConfig: AppConfig = null;

if (env === 'Dev') {
  // Load dev config
  appConfig = require('./app.config.dev.json');
} else if (env === 'Prod') {
  // Load prod config
  appConfig = require('./app.config.prod.json');
}
