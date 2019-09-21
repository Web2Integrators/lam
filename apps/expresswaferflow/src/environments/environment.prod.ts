import { apiEndpoints, ConsoleLogObserverService, LogLevel, Environment } from '@lamresearch/lam-common-eager';
//todo
//import { PdeAjaxLogObserverService } from '@lamresearch/lam-common-lazy';


export const environment: Environment = {
  production: true,

  logObservers: [
    {
      creator: ConsoleLogObserverService,
      level: LogLevel.error,
    },
    {
      //todo
      creator: ConsoleLogObserverService,
     level: LogLevel.info,
      options: { url: apiEndpoints.log.node },
    },
  ],

  disabledFeatures: {
    hydra: true,
    changeResource: true,
  },
};
