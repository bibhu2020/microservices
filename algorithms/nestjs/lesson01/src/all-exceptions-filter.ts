import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { MyLoggerService } from './my-logger/my-logger.service';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';


type MyResponseObj = {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object,
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
    private readonly logger = new MyLoggerService(AllExceptionsFilter.name);
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let myResponseObj: MyResponseObj = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: ''
        }

        // Add more Prisma Error Types if you want
        if (exception instanceof HttpException){
            myResponseObj.statusCode = exception.getStatus()
            myResponseObj.response = exception.getResponse()
        } else if (exception instanceof PrismaClientValidationError){ 
            myResponseObj.statusCode = 422
            myResponseObj.response = exception.message.replaceAll(/\n/g, ' ')
        } else if (exception instanceof PrismaClientKnownRequestError){ 
            myResponseObj.statusCode = 422
            myResponseObj.response = exception.message.replaceAll(/\n/g, ' ')
        } else {
            myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            myResponseObj.response = 'Internal Server Error'
        }

        response 
            .status(myResponseObj.statusCode) 
            .json(myResponseObj)

        this.logger.error(myResponseObj.response, AllExceptionsFilter.name)

        super.catch(exception, host)
    }
}
 