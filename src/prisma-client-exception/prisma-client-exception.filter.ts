import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, HttpStatus, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>();
    let status:number;
    switch(exception.code){
      case 'P2002':
        status = HttpStatus.CONFLICT
        response.status(status).json({
          statusCode: status,
          message: "The resource you want to create already exists.",
        });
        break;
      case 'P2003':
        status = HttpStatus.CONFLICT;
        response.status(status).json({
          statusCode: status,
          message: "The resource you want to use doesn't exist",
        });
        break;
      default:
        console.error('-------------PrismaClientKnownError-----------------------')
        super.catch(exception,host)
        break;
    }
  }
}
