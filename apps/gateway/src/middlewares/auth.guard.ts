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
    const ctx: any = GqlExecutionContext.create(context).getContext();
    const authHeader = request?.headers?.authorization || ctx?.req[Object.getOwnPropertySymbols(ctx?.req)[1]]?.authorization;
    if (request) {
      if (!authHeader) {
        return false;
      }
      await this.validateToken(authHeader);
      return true;
    } else {
      if (!ctx?.req[Object.getOwnPropertySymbols(ctx?.req)[1]]?.authorization) {
        return false;
      }
      ctx.user = await this.validateToken(authHeader);
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
    try {
      const decodedToken = await verify(token, config.JWT_TOKEN);
      return decodedToken;
    } catch (err) {
      const message = 'Token error:' + err.message;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
