import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Transport } from "@nestjs/microservices";
import { config } from "@commerce/shared";
import { ValidationPipe } from "@nestjs/common";
async function bootstrap() {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.REDIS,
        options: {
            url: `redis://${config.REDIS_URL}:${config.REDIS_PORT}`
        }
    });
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(() => console.log(`products module is listening `));
}
bootstrap();
