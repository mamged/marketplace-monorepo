"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const shared_1 = require("@commerce/shared");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            url: `redis://${shared_1.config.REDIS_URL}:${shared_1.config.REDIS_PORT}`
        }
    });
    await app.listen(() => console.log(`users module is listening`));
}
bootstrap();
//# sourceMappingURL=main.js.map