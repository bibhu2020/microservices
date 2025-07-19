import { ApploggerService } from '@bpm/common';
import { Injectable } from '@nestjs/common';

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number; // in ms
  serviceName: string; // Service name to track which service is failing
}

@Injectable()
export class CircuitbrakerService {
  private state: CircuitBreakerState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();

  constructor(private options: CircuitBreakerOptions,
              private readonly logger: ApploggerService
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
        //this.logger.log(`${this.options.serviceName} - Circuit is HALF_OPEN. Attempting recovery.`, CircuitbrakerService.name);
      } else {
        //this.logger.log(`${this.options.serviceName} - Circuit is OPEN. Request blocked.`, CircuitbrakerService.name);
        throw new Error(`${this.options.serviceName} - Circuit is OPEN`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure(err);
      throw err;
    }
  }

  private onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      //this.logger.log(`${this.options.serviceName} - Success count: ${this.successCount}`, CircuitbrakerService.name);
      if (this.successCount >= this.options.successThreshold) {
        this.reset();
        //this.logger.log(`${this.options.serviceName} - Circuit is now CLOSED`, CircuitbrakerService.name);
      }
    } else {
      this.reset();
      //this.logger.log(`${this.options.serviceName} - Circuit is CLOSED after success`, CircuitbrakerService.name);
    }
  }

  private onFailure(err: any) {
    const status = err?.response?.status || err?.status || 500;
  
    if (status <= 400) {
      //this.logger.log(`${this.options.serviceName} - Ignoring non-error status: ${status}`, CircuitbrakerService.name);
      return; // Don't count it as failure
    }
  
    this.failureCount++;
    //this.logger.log(`${this.options.serviceName} - Failure count: ${this.failureCount}`, CircuitbrakerService.name);
    this.logger.error(`${this.options.serviceName} - Failure: ${err.message || 'Unknown error'}`, CircuitbrakerService.name);
  
    if (this.failureCount >= this.options.failureThreshold) {
      this.trip();
      //this.logger.log(`${this.options.serviceName} - Circuit is OPEN due to repeated failures`, CircuitbrakerService.name);
    }
  }

  private reset() {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
    //this.logger.log(`${this.options.serviceName} - Circuit is RESET to CLOSED`, CircuitbrakerService.name);
  }

  private trip() {
    this.state = 'OPEN';
    this.nextAttempt = Date.now() + this.options.timeout;
    //this.logger.log(`${this.options.serviceName} - Circuit is TRIPPED to OPEN. Next attempt will be after ${this.options.timeout}ms.`, CircuitbrakerService.name);
  }

  public getState() {
    return this.state;
  }
}
