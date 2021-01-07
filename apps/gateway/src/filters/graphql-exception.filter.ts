import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import {  GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";

@Catch(HttpException)
export class GraphQLErrorFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        console.log(gqlHost.getRoot(), gqlHost.getContext(), gqlHost.getInfo());
        return exception;
    }
}