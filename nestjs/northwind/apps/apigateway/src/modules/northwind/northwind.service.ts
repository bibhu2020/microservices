import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
//import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { CircuitbrakerService } from '../../common/circuitbraker/circuitbraker.service';
import { ApploggerService } from '@bpm/common';

@Injectable()
export class NorthwindService {
    constructor(
    private readonly http: HttpService,
    private readonly circuitBreaker: CircuitbrakerService,
    private readonly logger: ApploggerService
  ) {}
  
  async forwardRequest(
    baseUrl: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD',
    path: string,
    headers: any,
    body: any,
  ) {
    const url = `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    this.logger.log(`Forwarding to ${url} using ${method}`, NorthwindService.name);

    // Prepare default config
    const config: AxiosRequestConfig = {
      headers: {...headers },
      url,
      method,
      validateStatus: (status) => status <= 500, // Avoid errors for 304, etc.
    };

    // Conditionally merge headers based on HTTP method
    if (method === 'GET' || method === 'HEAD') {
      // Create a copy of headers without 'content-type'
      const { ['content-type']: _, ...headersWithoutContentType } = headers;

      config.headers = {
        ...headersWithoutContentType,
        accept: 'application/json',
        'cache-control': 'no-cache',
        // 'if-none-match': '', // explicitly force full response (disable ETag)
      }; // Keep original headers for GET and HEAD
    } else {
      config.headers = {
        accept: 'application/json',
        'content-type': 'application/json', // Only for POST, PUT, DELETE, etc.
        'cache-control': 'no-cache',
        'if-none-match': '', // explicitly force full response (disable ETag)
      };
      config.data = body; // Add data only for methods other than GET/HEAD
    }


    //this.logger.log(config, NorthwindService.name);

    try {
      //this.logger.log('Sending request to service through circuit breaker', NorthwindService.name);
      const response = await this.circuitBreaker.call(() =>
         this.http.request(config).toPromise(), // toPromise() converts observable to promise
      );
      // Check if response is defined
      if (!response) {
        throw new InternalServerErrorException('No response received from service');
      }
      return response.data;
    } catch (error) {
      console.error(`Request failed:`, {
        message: error?.message,
        code: error?.code,
        response: error?.response?.data,
        status: error?.response?.status,
        stack: error?.stack,
      });
      throw new InternalServerErrorException('Failed to reach service');
    }
  }
}
