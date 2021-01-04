"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcryptjs_1 = require("bcryptjs");
const microservices_1 = require("@nestjs/microservices");
let UserService = class UserService {
    constructor(users) {
        this.users = users;
    }
    updateToCustomer(id, gateway_customer_id) {
        return this.users.update(id, {
            gateway_customer_id
        });
    }
    findById(id) {
        return this.users.findOneOrFail(id);
    }
    fetchUsersByIds(ids) {
        return this.users.findByIds(ids);
    }
    async me({ id }) {
        const user = await this.users.findOneOrFail(id, {
            relations: ["address"]
        });
        return user.toResponseObject(false);
    }
    async get(page = 1) {
        const options = {
            relations: ["address"],
            skip: 25 * (page - 1),
            take: 25
        };
        return this.users.find(options);
    }
    async login({ email, password }) {
        const user = await this.users.findOneOrFail({
            where: { email }
        });
        if (!bcryptjs_1.compareSync(password, user.password)) {
            throw new microservices_1.RpcException(new common_1.NotFoundException("Invalid Credentials..."));
        }
        return user.toResponseObject();
    }
    async register({ email, password, password_confirmation, seller, name }) {
        if (password != password_confirmation) {
            throw new microservices_1.RpcException(new common_1.NotFoundException("Password and password_confirmation should match"));
        }
        const count = await this.users.count({
            where: {
                email
            }
        });
        if (count) {
            throw new microservices_1.RpcException(new common_1.NotFoundException("email exists, please pick up another one."));
        }
        let user = await this.users.create({
            name,
            seller,
            email,
            password
        });
        user = await this.users.save(user);
        return user.toResponseObject();
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map