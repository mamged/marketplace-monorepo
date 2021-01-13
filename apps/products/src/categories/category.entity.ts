import {Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent} from "typeorm";

@Entity('Categories')
@Tree("closure-table")
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @TreeChildren()
    children: CategoryEntity[];

    @TreeParent()
    parent: CategoryEntity;
}