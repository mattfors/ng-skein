// Polyfill Node.js core module 'events' for PouchDB
import { EventEmitter } from 'events';

(window as any).global = window;
(window as any).EventEmitter = EventEmitter;

// ✅ Use modern Angular testing setup (Angular 16+)
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
