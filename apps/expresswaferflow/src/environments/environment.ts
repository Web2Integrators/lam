import { apiEndpoints, ConsoleLogObserverService, LogLevel, Environment } from '@lamresearch/lam-common-eager';
//todo
//import { PdeAjaxLogObserverService } from '@lamresearch/lam-common-lazy';

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
