import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 50})
    name: string;

    @Column({type: 'varchar', length: 100})
    email: string;

    @Column({type: 'varchar', length: 100})
    password: string;

    @CreateDateColumn({type: 'timestamp', name: 'created_at'})
    createdAt: Date;
}