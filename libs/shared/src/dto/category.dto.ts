import { UserDTO } from './user.dto';
export interface CategoryDTO {
  id: string;
  name: string;
  children: string[];
  parent: string;
}
