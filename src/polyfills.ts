// Polyfills pour Angular
import 'zone.js/dist/zone';

// Solution pour 'global is not defined'
(window as any).global = window;

// Polyfills pour WebSocket/STOMP
import { Buffer } from 'buffer';
import * as process from 'process';

(window as any).Buffer = Buffer;
(window as any).process = process;

// Autres polyfills si nécessaire
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}