/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './user.entity';
import { Repository } from 'typeorm';
import { createLinkDto } from './dto/create-link.dto'
import { updateLinkDto } from './dto/update-link.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(Link) private linkRepository: Repository<Link>) {}

    createLink(link: createLinkDto){
        const newLink = this.linkRepository.create(link)
        return this.linkRepository.save(newLink)
    }

    getAllLinks(){
        return this.linkRepository.find()
    }

    async getOneLink(link: string, pass?: string): Promise<updateLinkDto | null> {
        const pLink = await this.linkRepository.findOne({
            where: {
                link: link,
                valid: 0
            }
        });

        if (pLink) {
            if(pLink.expiredAt.getTime() > Date.now()){
                if (pLink.password !== null) {
                    // Si hay una contraseña, incluirla en el objeto de retorno
                    if (pLink.password == pass){
                        return pLink;
                    }
                    else{
                        return null
                    }
                } else {
                    // Si no hay contraseña, devolver el enlace sin modificar
                    return pLink;
                }
            }
            else{
                return null
            }
        } else {
            return null;
        }
    }

    async updateAmount(link: string, pass?: string): Promise<string> { // Hacer que el método sea asíncrono
        const currentLink = await this.getOneLink(link, pass); // Esperar a que la función getAmountLink() se resuelva
        if (currentLink !== null) { // Verificar si el valor actual no es nulo
            if (currentLink.valid == 0){
                await this.linkRepository.update({ link }, { entryAmount: currentLink.entryAmount + 1}); // Sumar 1 al valor actual y actualizar el registro
                return currentLink.target
            }
            else{
                return null
            }     
        }
        return null
    }

    invalidLink(link: string){
        const valid = this.linkRepository.update({link}, {valid: 1})
        if(valid){
            return 'URL invalidada correctamente'
        }
        else{
            return '404'
        }
    }
}
