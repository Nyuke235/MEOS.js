/**
 * JSMEOS Playground
 * File to test the API
 * Run with : npm run play
 */

import { TsTzSpan } from '../src';
import { initMeos } from '../src/core/meos';

await initMeos();

using morning = TsTzSpan.fromString('[2024-01-15 09:00:00+00, 2024-01-15 12:00:00+00)');
using afternoon = TsTzSpan.fromString('[2024-01-15 14:00:00+00, 2024-01-15 18:00:00+00)');

const morningMs = morning.durationMs();
console.log(`Durée totale de la matinée : ${morningMs / 3600000} h`);