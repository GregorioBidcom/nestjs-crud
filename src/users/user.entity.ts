/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({name: 'link_tracker'})
export class Link {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    target: string

    @Column({nullable: true})
    link: string

    //El registro se crea, y es valido solo durante 1 hora 
    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    expiredAt: Date

    @Column({nullable: true, default: 0}) //0 es valido, 1 es invalido
    valid: number

    @Column({nullable: true, default: 0})
    entryAmount: number

    @Column({nullable: true})
    password: string
}