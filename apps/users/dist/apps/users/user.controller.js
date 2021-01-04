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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const gateway_1 = require("@commerce/gateway");
const gateway_2 = require("@commerce/gateway");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("typeorm");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(users) {
        this.users = users;
    }
    index() {
        return this.users.get();
    }
    login(data) {
        return this.users.login(data);
    }
    register(data) {
        return this.users.register(data);
    }
    me(id) {
        return this.users.me({ id });
    }
    fetchUserById(id) {
        return this.users.findById(id);
    }
    fetchUsersByIds(ids) {
        return this.users.fetchUsersByIds(ids);
    }
    handleCreatedCustomer({ user_id, gateway_customer_id }) {
        return this.users.updateToCustomer(user_id, gateway_customer_id);
    }
};
__decorate([
    microservices_1.MessagePattern("users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "index", null);
__decorate([
    microservices_1.MessagePattern("login-user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof gateway_1.LoginUser !== "undefined" && gateway_1.LoginUser) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "login", null);
__decorate([
    microservices_1.MessagePattern("register-user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof gateway_2.RegisterUser !== "undefined" && gateway_2.RegisterUser) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "register", null);
__decorate([
    microservices_1.MessagePattern("current-loggedin-user"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_1.ObjectID]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "me", null);
__decorate([
    microservices_1.MessagePattern("fetch-user-by-id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "fetchUserById", null);
__decorate([
    microservices_1.MessagePattern("fetch-users-by-ids"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "fetchUsersByIds", null);
__decorate([
    microservices_1.EventPattern("customer_created"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "handleCreatedCustomer", null);
UserController = __decorate([
    common_1.Controller("users"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map