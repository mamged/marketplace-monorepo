import { Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import {  GqlArgumentsHost, GqlExceptionFilter } from "@nestjs/graphql";

@Catch(HttpException)
export class GraphQLErrorFilter implements GqlExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        console.log('<<<GraphQLErrorFilter>>>\n', '<<<getRoot>>>\n', gqlHost.getRoot(), '<<</getRoot>>>\n', '<<<getRoot>>>\n', gqlHost.getContext(), '<<</getRoot>>>\n', '<<<getRoot>>>\n', gqlHost.getInfo(), '<<</getRoot>>>\n', '<<</GraphQLErrorFilter>>>');
        return exception;
    }
}