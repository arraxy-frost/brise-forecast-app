import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    passwordHash: string;
}