class CircuitBreaker {
    constructor(requestFn, options = {}) {
      this.requestFn = requestFn;
  
      // Options with defaults
      this.failureThreshold = options.failureThreshold || 5;
      this.successThreshold = options.successThreshold || 2;
      this.timeout = options.timeout || 10000; // 10 seconds
  
      // Internal state
      this.state = 'CLOSED';
      this.failureCount = 0;
      this.successCount = 0;
      this.nextAttempt = Date.now();
    }
  
    async call(...args) {
      // Handle OPEN state
      if (this.state === 'OPEN') {
        if (Date.now() >= this.nextAttempt) {               //if the timeout is reached, allow requests to pass through
          this.state = 'HALF_OPEN';
          console.log('Circuit breaker state: HALF_OPEN');
        } else {                                            //until the timeout is reached, do not allow any requests.
          throw new Error('Circuit is OPEN. Fallback response.'); 
        }
      }
  
      try {
        const response = await this.requestFn(...args);
        this._recordSuccess();
        return response;
      } catch (error) {
        this._recordFailure();
        throw error;
      }
    }
  
    _recordSuccess() {
      if (this.state === 'HALF_OPEN') {
        this.successCount++;
        if (this.successCount >= this.successThreshold) {
          this._reset();
          console.log('Circuit breaker state: CLOSED');
        }
      } else {
        this._reset();
      }
    }
  
    _recordFailure() {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.timeout;
        console.warn('Circuit breaker state: OPEN');
      }
    }
  
    _reset() {
      this.failureCount = 0;
      this.successCount = 0;
      this.state = 'CLOSED';
    }
  }

  // ✅ Export it
module.exports = CircuitBreaker;