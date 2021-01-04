import { UserDTO } from "./user.dto";
export interface ProductDTO {
    id: string;
    user: UserDTO;
    title: string;
    description: string;
    image: string;
    price: string;
    created_at: Date;
}
