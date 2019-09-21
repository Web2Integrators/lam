import { apiEndpoints,ConsoleLogObserverService ,LogLevel } from '@lamresearch/lam-common-eager';
import { PdeAjaxLogObserverService } from '@lamresearch/lam-common-lazy';
import { Environment } from './environment-types';

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
