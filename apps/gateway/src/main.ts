import { NestFactory } from "@nestjs/core";
import {
    FastifyAdapter,
    NestFastifyApplication
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ValidationPipe } from "./pipes/validation.pipe";
import { config } from "@commerce/shared";
import * as helmet from "helmet";
import * as fastifyRateLimit from "fastify-rate-limit";
import { redis } from "./utils/redis";
// import * as FastifyCompress from "fastify-compress";
import * as bodyParser from "body-parser";
import { xssFilter } from "helmet";
import * as hpp from "hpp";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // await app.listen(3000);
    // console.log(`Application is running on: ${await app.getUrl()}`);
    // const fastify = new FastifyAdapter({ logger: true });
    // const app = await NestFactory.create<NestFastifyApplication>(
    //     AppModule,
    //     fastify
    // );
    // fastify.register(fastifyRateLimit.default, {
    //     max: 100,
    //     timeWindow: "1 minute",
    //     redis,
    //     whitelist: ["127.0.0.1"]
    // });
    app.enableCors();
    // app.use(helmet());
    // app.use(helmet.noSniff());
    // app.use(helmet.ieNoOpen());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(xssFilter());
    app.use(hpp());
    // app.use(
    //     helmet.contentSecurityPolicy({
    //         directives: {
    //             defaultSrc: ["'self'"],
    //             imgSrc: ["'self'"],
    //         }
    //     })
    // );
    
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(Number(config.GATEWAY_PORT));
    console.log(`Gateway is running on: http://127.0.0.1:${config.GATEWAY_PORT}`);
}
bootstrap();
console.log('hello');
