// tslint:disable:no-console
import { TestBed } from '@angular/core/testing';

import { ConsoleLogObserver, ConsoleLogObserverService } from './console-log-observer.service';
import { LogItem, LogLevel } from './log.service';

describe('ConsoleLogObserverService', () => {
  let svc: ConsoleLogObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsoleLogObserverService],
    });

    svc = TestBed.get(ConsoleLogObserverService);
  });

  describe('createObserver', () => {
    it('should generate the observer', () => {
      const observer = svc.createObserver();

      expect(observer).toBeTruthy();
    });
  });
});

describe('ConsoleLogObserver', () => {
  let obs: ConsoleLogObserver;

  beforeEach(() => {
    obs = new ConsoleLogObserver();
    console.error = jasmine.createSpy('error');
    console.warn = jasmine.createSpy('warn');
    console.info = jasmine.createSpy('info');
    console.debug = jasmine.createSpy('debug');
    console.log = jasmine.createSpy('log');
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

  describe('next', () => {
    it('should handle a warn with the simple case', () => {
      obs.next(conjureLogItem());
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith('[t] m', undefined);
      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should handle an error with details', () => {
      obs.next(conjureLogItem(LogLevel.error, 'foo'));
      expect(console.error).toHaveBeenCalledWith('[t] m', 'foo');
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should handle an info with details', () => {
      obs.next(conjureLogItem(LogLevel.info, 'foo'));
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledWith('[t] m', 'foo');
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should handle debug with details', () => {
      obs.next(conjureLogItem(LogLevel.debug, 'foo'));
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).toHaveBeenCalledWith('[t] m', 'foo');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should handle an invalid logLevel with details', () => {
      obs.next(conjureLogItem(-834, 'foo'));
      expect(console.error).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('[t] m', 'foo');
    });
  });
});
