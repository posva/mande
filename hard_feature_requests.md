# Hard-Level Feature Requests for TypeScript HTTP Client Libraries

Based on Project Mars rubrics: **Hard = 4+ hours for experienced contributor, ties together multiple system components, requires deep architectural decisions**

---

## Repository: **posva/mande** ⭐ 1.3k

### Feature Request #1: Request Retry with Exponential Backoff and Jitter

**Difficulty**: Hard (4-6 hours)

**Description**: 
Implement an opt-in automatic retry mechanism for failed HTTP requests with configurable exponential backoff and jitter to prevent request synchronization issues (thundering herd problem).

**Why This is Hard**:
- Requires complex async coordination and state management
- Must integrate seamlessly with existing interceptor system
- Needs careful handling of different error types (network vs HTTP errors)
- Exponential backoff calculation with jitter requires mathematical precision
- Must respect AbortSignal and cancellation
- Needs to handle edge cases (concurrent retries, cleanup, memory leaks)

**Requirements**:
1. **Opt-in per-request or global configuration**
   - `retry: { attempts: 3, delay: 1000, backoff: 'exponential', jitter: true }`
   - Global defaults via `mande(baseURL, { retry: {...} })`
   - Per-request override via `options.retry`

2. **Exponential Backoff Calculation**
   - Base delay: `delay * (2 ^ attemptNumber)`
   - Maximum delay cap (e.g., 30 seconds)
   - Minimum delay between retries

3. **Jitter Implementation**
   - Add random jitter to prevent synchronized retries
   - Full jitter: `random(0, calculatedDelay)`
   - Equal jitter: `calculatedDelay/2 + random(0, calculatedDelay/2)`
   - Configurable jitter strategy

4. **Retry Conditions**
   - Retry on network errors (fetch failures, timeouts)
   - Retry on specific HTTP status codes (e.g., 429, 500, 502, 503, 504)
   - Configurable retry condition function: `shouldRetry: (error, attempt) => boolean`
   - Do not retry on 4xx errors (except configurable ones like 429)

5. **Integration with Existing Features**
   - Work with interceptors (`onRequest`, `onResponse`, `onError`)
   - Respect `AbortSignal` - cancel retries if request is aborted
   - Preserve request options and body across retries
   - Handle timeout scenarios correctly

6. **Error Propagation**
   - After all retries exhausted, throw the last error
   - Provide retry metadata in error (attempt count, total time)
   - Maintain backward compatibility with existing error handling

**Implementation Challenges**:
- Managing retry state without memory leaks
- Ensuring retries are cancelled when request is aborted
- Coordinating retries with timeout mechanisms
- Testing complex async scenarios (timing, race conditions)
- Maintaining library's lightweight nature (<1KB size constraint)

**Test Requirements**:
- Retry on network failures
- Retry on specific HTTP status codes
- Exponential backoff timing verification
- Jitter randomness verification
- AbortSignal cancellation during retry
- Maximum retry attempt limits
- Per-request and global configuration
- Integration with interceptors

**Estimated Time**: 4-6 hours for senior developer

---

### Feature Request #2: Request Queue with Priority and Concurrency Limits

**Difficulty**: Hard (5-7 hours)

**Description**:
Implement a request queue system that allows prioritizing requests and limiting concurrent requests to prevent overwhelming servers or hitting rate limits.

**Why This is Hard**:
- Complex queue data structure with priority support
- Concurrency control and semaphore-like behavior
- Request ordering and fairness algorithms
- Integration with existing request flow
- Memory management for queued requests
- AbortSignal handling for queued requests

**Requirements**:
1. **Queue Configuration**
   - `queue: { maxConcurrent: 5, priority: 'fifo' | 'priority' }`
   - Per-request priority: `options.priority: number` (higher = more priority)

2. **Concurrency Control**
   - Limit number of simultaneous in-flight requests
   - Queue requests when limit reached
   - Automatically process queued requests when slots free up

3. **Priority Queue**
   - Higher priority requests processed first
   - FIFO within same priority level
   - Fair scheduling to prevent starvation

4. **Queue Management**
   - Abort queued requests when original request is cancelled
   - Timeout for queued requests (max wait time)
   - Queue size limits to prevent memory issues

5. **Integration**
   - Work with all HTTP methods (GET, POST, etc.)
   - Compatible with interceptors
   - Respect AbortSignal for both queued and in-flight requests

**Estimated Time**: 5-7 hours for senior developer

---

## Repository: **ecyrbe/zodios** ⭐ 1.9k

### Feature Request #3: Request Deduplication/Coalescing

**Difficulty**: Hard (4-6 hours)

**Description**: 
Implement request coalescing that automatically detects identical in-flight requests and shares a single network call, returning the same response (or error) to all callers. Similar to the ofetch deduplication feature.

**Why This is Hard**:
- Complex async coordination and subscriber tracking
- Request identity matching (method, URL, headers, body)
- Race condition handling in concurrent scenarios
- AbortSignal coordination (individual vs. shared cancellation)
- Integration with Zod validation and plugin system
- Memory management and cleanup

**Requirements**:
1. **Opt-in Configuration**
   - `dedupe: true` per-request or globally
   - Request identity based on method, URL, headers, body

2. **Identity Matching**
   - Same HTTP method
   - Same URL (including query parameters, order-insensitive)
   - Same headers (case-insensitive, order-insensitive)
   - Same body content

3. **Subscriber Management**
   - Track multiple callers for same request
   - Share single network call
   - Propagate response/error to all subscribers

4. **Cancellation Handling**
   - Individual abort only affects that subscriber
   - All subscribers abort → cancel underlying request
   - Proper cleanup and memory management

5. **Integration**
   - Work with Zod validation (validate once, share result)
   - Compatible with plugin system
   - Respect interceptors (call once per unique request)

**Estimated Time**: 4-6 hours for senior developer

---

### Feature Request #4: Response Caching with TTL and Invalidation Strategies

**Difficulty**: Hard (5-7 hours)

**Description**:
Implement a sophisticated response caching system with time-to-live (TTL), cache size limits, and multiple invalidation strategies (time-based, manual, tag-based).

**Why This is Hard**:
- Complex cache data structure and eviction policies
- Memory management and size limits
- Cache key generation and collision handling
- Integration with Zod validation (cache validated responses)
- Invalidation strategies (time, manual, tags, dependencies)
- Thread-safety considerations for concurrent access

**Requirements**:
1. **Cache Configuration**
   - `cache: { ttl: 60000, maxSize: 100, strategy: 'lru' }`
   - Per-request cache control: `options.cache: { ttl: number, key?: string }`

2. **Cache Key Generation**
   - Based on method, URL, headers, body
   - Custom key function support
   - Collision handling

3. **TTL Management**
   - Time-based expiration
   - Automatic cleanup of expired entries
   - Refresh-ahead support

4. **Cache Eviction**
   - LRU (Least Recently Used) eviction
   - Max size limits
   - Memory-efficient implementation

5. **Invalidation Strategies**
   - Manual invalidation: `api.invalidateCache(pattern)`
   - Tag-based invalidation: `options.cache.tags: string[]`
   - Dependency-based invalidation
   - Time-based automatic expiration

6. **Integration**
   - Cache validated Zod responses
   - Work with plugin system
   - Respect cache-control headers from server
   - Handle cache errors gracefully

**Estimated Time**: 5-7 hours for senior developer

---

## Repository: **Bekacru/better-fetch** ⭐ 877

### Feature Request #5: Request Batching with Automatic Aggregation

**Difficulty**: Hard (6-8 hours)

**Description**:
Implement automatic request batching that collects multiple requests within a time window and sends them as a single batch request, then distributes responses back to original callers.

**Why This is Hard**:
- Complex batching algorithm and time window management
- Request aggregation and response distribution
- Maintaining request-response mapping
- Error handling for partial batch failures
- Integration with validation and plugin system
- Backpressure and queue management

**Requirements**:
1. **Batching Configuration**
   - `batch: { window: 100, maxSize: 10, endpoint: '/api/batch' }`
   - Automatic detection of batchable requests

2. **Request Aggregation**
   - Collect requests within time window
   - Aggregate into batch request format
   - Maintain request metadata for response mapping

3. **Response Distribution**
   - Map batch responses to original requests
   - Handle partial failures
   - Preserve individual request errors

4. **Integration**
   - Work with validation system
   - Compatible with plugins
   - Respect AbortSignal

**Estimated Time**: 6-8 hours for senior developer

---

## Recommendation

**Best Choice for Hard-Level Problem**: **posva/mande - Request Retry with Exponential Backoff and Jitter**

**Why**:
1. ✅ **Perfect Difficulty**: 4-6 hours, ties together multiple components (interceptors, error handling, async coordination)
2. ✅ **Real-World Value**: Essential feature for production HTTP clients
3. ✅ **Well-Scoped**: Not too big (repo-wide refactor) or too small (trivial fix)
4. ✅ **Testable**: Clear success criteria, deterministic behavior
5. ✅ **Similar Complexity to ofetch deduplication**: Async coordination, state management, edge cases
6. ✅ **Architectural Decisions**: Retry strategy design, jitter algorithm, integration approach
7. ✅ **Solvable**: Clear requirements, existing patterns in other libraries to reference

**Alternative**: If you prefer a different library, **ecyrbe/zodios - Request Deduplication** is also excellent and very similar to your ofetch problem.

