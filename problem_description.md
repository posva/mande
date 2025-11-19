# Request Retry with Exponential Backoff and Jitter

## Problem Brief

Implement automatic retry for failed HTTP requests with exponential backoff and jitter. Retry mechanism must be opt-in, configurable per-request or globally, and integrate with existing mande features (interceptors, AbortSignal, error handling). Support configurable retry attempts, delays, backoff strategy, jitter, and retry conditions.

## Agent Instructions

- Implement opt-in retry mechanism via `retry` option in instance or per-request options
- Apply exponential backoff between retries and respect any configured `maxDelay` cap
- Support delay modes: no jitter (use the raw backoff delay), full jitter (maximum randomization within the backoff window), and equal jitter (moderate randomization within that window)
- Retry on network errors (fetch failures, timeouts) and configurable HTTP status codes (default: 429, 500, 502, 503, 504); do not retry on 4xx errors except configurable ones; support custom retry condition function: `shouldRetry: (error, attempt) => boolean`
- Cancel retries when AbortSignal is aborted
- Preserve request options and body across retries
- Throw last error after all retries exhausted
- Integrate with existing interceptors and maintain backward compatibility when retry is not configured

## Test Assumptions

- Retry option is named `retry` and accepts object with: `attempts` (number, total tries including initial request), `delay` (number, milliseconds), `maxDelay` (number, milliseconds, optional), `backoff` (string, default 'exponential'), `jitter` (boolean or 'full'/'equal', default false/disabled), `statusCodes` (array of numbers, optional), `shouldRetry` (function, optional)
- Per-request `retry: false` disables retry for that request
- Configuration provided in `OptionsRaw` for instance-level defaults and `Options` for per-request overrides
