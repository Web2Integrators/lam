import { apiEndpoints,ConsoleLogObserverService ,LogLevel } from '@lamresearch/lam-common-eager';
import { PdeAjaxLogObserverService } from '@lamresearch/lam-common-lazy';
import { Environment } from './environment-types';


export const environment: Environment = {
  production: false,

  logObservers: [
    {
      creator: ConsoleLogObserverService,
      level: LogLevel.debug,
    },
    {
      //Todo
      creator: ConsoleLogObserverService,
      level: LogLevel.error,
      options: { url: apiEndpoints.log.node }, // By Default it sends logs to Node
    },
  ],

  disabledFeatures: {},
};
