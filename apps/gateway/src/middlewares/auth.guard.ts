import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  GqlExecutionContext,
  GraphQLArgumentsHost,
  GraphQLExecutionContext,
} from '@nestjs/graphql';
import { config } from '@commerce/shared';
import { verify } from 'jsonwebtoken';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request) {
      if (!request.headers.authorization) {
        return false;
      }
      await this.validateToken(request.headers.authorization);
      return true;
    } else {
      const ctx: any = GqlExecutionContext.create(context).getContext();
      if (!ctx.headers.authorization) {
        return false;
      }
      ctx.user = await this.validateToken(ctx.headers.authorization);
      return true;
    }
  }
  async validateToken(auth: string) {
    if (auth.indexOf('Bearer') !== 0) {
      throw new HttpException(
        'Invalid Token has been passed',
        HttpStatus.FORBIDDEN,
      );
    }
    const token = auth.split(' ')[1];
    console.log('splitted token', token);
    try {
      const decodedToken = await verify(token, config.JWT_TOKEN);
      return decodedToken;
    } catch (err) {
      const message = 'Token error:' + err.message;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
