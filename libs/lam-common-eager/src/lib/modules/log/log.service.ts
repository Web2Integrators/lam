import { Injectable } from '@angular/core';
import { Observer, Subject } from 'rxjs';

// Log levels are adapted from npm log levels, which are what WinstonJS uses by default. Using the
// same codes makes it a little easier to translate client-side logs to the server.
//
// XXX: I don't like this "lower number means higher severity" business, even though that's what
// RFC5424 recommends and what npm uses. It doesn't match the way many (maybe most?) other loggers
// work, or the way people think. Consider flipping it, and just dealing with it on the server side.
//
export enum LogLevel {
  error = 0,
  warn = 1,
  info = 2,
  debug = 4,

  // The "silly" and "verbose" levels from npm aren't used.
  // verbose = 3,
  // silly = 5,
}

export interface LogItem {
  // XXX: Should the topic actually be a hierarchy instead of a single topic? Perhaps an ordered
  // list of topics from least to most specific? Or maybe an unordered list, like tags?

  topic: string;
  timestamp: Date;
  level: number;
  message: string;
  details?: any;
}

export interface LoggerOptions {
  quiet?: boolean; // Suppress debug message on creation
}

export type LogObserver = Observer<LogItem>;

export class Logger {
  constructor(public topic: string, private logEntries: Subject<LogItem>, options?: LoggerOptions) {
    if (!(options && options.quiet)) {
      this.debug(`Created logger for topic "${topic}"`);
    }
  }

  debug(message: string, ...details: any[]): void {
    this.log(LogLevel.debug, message, details);
  }

  info(message: string, ...details: any[]): void {
    this.log(LogLevel.info, message, details);
  }

  warn(message: string, ...details: any[]): void {
    this.log(LogLevel.warn, message, details);
  }

  error(message: string, ...details: any[]): void {
    this.log(LogLevel.error, message, details);
  }

  // All the other logging methods fall through to this method that packages the various bits of
  // information into a LogItem that's then pushed into the log entries Subject.
  //
  // Note that, unlike the public methods, `details` is not a "rest" parameter, to avoid wrapping it
  // inside an extra array.
  //
  // Passing as Date Object and NOT string for easier manipulation downstream
  //
  log(level: number, message: string, details: any[]) {
    this.logEntries.next({
      topic: this.topic,
      timestamp: new Date(),
      level,
      message,
      details,
    });
  }
}

export class LogEntries extends Subject<LogItem> {}

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(private logEntries: LogEntries) {}

  createLogger(topic: string, options?: LoggerOptions) {
    return new Logger(topic, this.logEntries, options);
  }
}
