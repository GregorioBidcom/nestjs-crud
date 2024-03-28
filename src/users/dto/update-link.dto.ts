/* eslint-disable prettier/prettier */
export class updateLinkDto{
    id:number
    target: string
    link?: string
    expiredAt: Date
    valid: number
    entryAmount: number
    password: string
}