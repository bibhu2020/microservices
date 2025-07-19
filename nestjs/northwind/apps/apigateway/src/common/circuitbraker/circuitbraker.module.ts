import { Module } from '@nestjs/common';
import { CircuitbrakerService } from './circuitbraker.service';
import { ApploggerService } from '@bpm/common';

@Module({
  providers: [{
    provide: CircuitbrakerService,
    useFactory: (logger: ApploggerService) => {
      return new CircuitbrakerService({
        failureThreshold: 3,  // Fail after 3 consecutive failures
        successThreshold: 2,  // Recover after 2 consecutive successes
        timeout: 5000,  // Timeout after 5 seconds
        serviceName: 'apigateway',  // The name of the service being protected by the circuit breaker
      }, logger);
    },
    inject: [ApploggerService],
  }],
  exports: [CircuitbrakerService], // <-- must export it
})
export class CircuitbrakerModule {}
