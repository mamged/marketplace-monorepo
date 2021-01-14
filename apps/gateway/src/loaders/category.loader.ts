import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { UserDTO } from "@commerce/shared";
import DataLoader = require("dataloader"); // commonjs module

import { IDataLoader } from "../contracts/nest-dataloader";
import { UserService } from "../users/user.service";

@Injectable()
export class CategoryDataLoader implements IDataLoader<string, UserDTO> {
    constructor(private readonly dataLoader: DataLoader<any, any>) {}

    public static async create(
        userService: UserService
    ): Promise<CategoryDataLoader> {
        const dataloader = new DataLoader<string, UserDTO>(async ([...ids]) => {
            let users = await userService.fetchUsersByIds(ids);
            return ids.map(key => users.find(entity =>  entity.id.toString() === key));
        });
        return new CategoryDataLoader(dataloader);
    }
    public async load(id: string) {
        return this.dataLoader.load(id);
    }
}
