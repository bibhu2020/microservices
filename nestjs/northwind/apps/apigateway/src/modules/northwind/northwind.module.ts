import { Module } from '@nestjs/common';
import { NorthwindController } from './northwind.controller';
import { NorthwindService } from './northwind.service';
import { CircuitbrakerModule } from '../../common/circuitbraker/circuitbraker.module';
import { CircuitbrakerService } from '../../common/circuitbraker/circuitbraker.service';
import { HttpModule } from '@nestjs/axios';
import { ApploggerService } from '@bpm/common';

@Module({
  imports: [
    HttpModule,               // ✅ Import this
    CircuitbrakerModule      // ✅ Import CircuitbreakerService from its module
  ],
  controllers: [NorthwindController],
  providers: [NorthwindService, 
    {
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
    },
  ],
  exports: [NorthwindService],
})
export class NorthwindModule {}
