// tslint:disable:no-console
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AjaxLogObserver, AjaxLogObserverOptions } from '../log/ajax-log-observer.service';
import { LogItem, LogLevel } from '../log/log.service';
import { PdeAjaxLogObserver, PdeAjaxLogObserverService } from './pde-ajax-log-observer.service';
import { ElectronService } from '../electron.service';
import { SpyObject } from '../../testing/spy-object.spec-util';
import { apiEndpoints } from '../common/shared';

describe('PdeAjaxLogObserverService', () => {
  let svc: PdeAjaxLogObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PdeAjaxLogObserverService, ElectronService],
    });

    svc = TestBed.get(PdeAjaxLogObserverService);
  });

  describe('createObserver', () => {
    it('should generate the observer', () => {
      const options: AjaxLogObserverOptions = { url: 'log' };
      const observer = svc.createObserver(options);

      expect(observer).toBeTruthy();
    });
  });
});

describe('PdeAjaxLogObserver', () => {
  let obs: PdeAjaxLogObserver;
  let obsSvc: PdeAjaxLogObserverService;
  let electronSvc: jasmine.SpyObj<ElectronService>;
  const options = { url: 'log' };
  const mockBackendUrl = 'http://mockurl';
  const envConfig = { backendLogging: false, backendUrl: mockBackendUrl };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PdeAjaxLogObserverService,
        {
          provide: ElectronService,
          useValue: new SpyObject(ElectronService),
        },
      ],
    });
    obsSvc = TestBed.get(PdeAjaxLogObserverService);
    electronSvc = TestBed.get(ElectronService);
  });

  function conjureLogItem(
    level = LogLevel.warn,
    details?: string,
    topic = 't',
    timestamp = new Date(),
    message = 'm',
  ): LogItem {
    return {
      topic,
      timestamp,
      level,
      message,
      details,
    };
  }

  function configureElectronEnv(
    isElectron: boolean,
    backendLogging?: boolean,
    backendUrl?: string,
  ): void {
    electronSvc.isElectron.and.returnValue(isElectron);
    envConfig.backendLogging = !!backendLogging;
    envConfig.backendUrl = backendUrl || '';
    electronSvc.getBackendLoggingConfig.and.returnValue(Promise.resolve(envConfig));
  }

  describe('formatReqPayload', () => {
    it('should create node log object when not in electron app', async () => {
      configureElectronEnv(false);
      spyOn(AjaxLogObserver.prototype, 'formatReqPayload');
      const item = conjureLogItem();
      obs = await obsSvc.createObserver(options);
      obs.formatReqPayload([item]);

      expect(AjaxLogObserver.prototype.formatReqPayload).toHaveBeenCalledWith([item]);
      expect(obs.url).toBe(apiEndpoints.log.node);
    });

    it('should create node log object when not backendlogging', async () => {
      configureElectronEnv(true, false, mockBackendUrl);
      spyOn(AjaxLogObserver.prototype, 'formatReqPayload');
      const item = conjureLogItem();
      obs = await obsSvc.createObserver(options);
      obs.formatReqPayload([item]);

      expect(AjaxLogObserver.prototype.formatReqPayload).toHaveBeenCalledWith([item]);
      expect(obs.url).toBe(apiEndpoints.log.node);
    });

    it('should create backend log object when backendLogging in electron app', async () => {
      configureElectronEnv(true, true, mockBackendUrl);
      const item = conjureLogItem();
      const expected = {
        messages: [
          {
            message: JSON.stringify({
              summary: item.message,
              details: item.details,
            }),
            timestamp: item.timestamp.getTime(),
            source: `PDE-${item.topic}`,
            level: LogLevel[item.level],
            category: 'PDE',
          },
        ],
      };

      // Creating here instead of in beforeEach()
      // to configureElectron Env before creating observer
      obs = await obsSvc.createObserver(options);
      const actual = obs.formatReqPayload([item]);

      expect(actual).toEqual(expected);
      expect(obs.url).toBe(mockBackendUrl + apiEndpoints.log.backend);
    });
  });
});
