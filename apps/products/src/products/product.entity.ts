import {
    Column,
    Entity,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

@Entity("products")
export class ProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("integer")
    price: number;
    @PrimaryGeneratedColumn("uuid")
    user_id: string;
    @Column("integer", { default: 1 })
    quantity: number;
    @Column("text", { unique: true })
    title: string;
    @Column("text")
    description: string;

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    image: string;

    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
