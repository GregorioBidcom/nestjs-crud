/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Param, Redirect , NotFoundException, Put, Query } from '@nestjs/common';
import { createLinkDto } from './dto/create-link.dto';
import { UsersService } from './users.service';
import { v4 } from 'uuid';
import { Link } from './user.entity';

@Controller('links')
export class UsersController {

    constructor (private linkService: UsersService) {}

    @Post() // Crear un link
    async createLink(@Body() newLink: createLinkDto, @Query('pass') pass: string) {
        newLink.link = v4(); // v4 genera un id aleatorio para el hash de la url
        newLink.password = pass; // Asignamos la contraseña al nuevo enlace
        await this.linkService.createLink(newLink);
        return newLink.link;
    }

    @Get() //Todos los Link
    readLinks() : Promise<Link[]>{
        return this.linkService.getAllLinks()
    }

    @Get('/stats/:link') 
    async readStats(
        @Param('link') link: string, 
        @Query('pass') pass: string
    ) {
        const linkStat = await this.linkService.getOneLink(link, pass);
        if (linkStat) {
            return 'Esta url se visitó ' + linkStat.entryAmount + ' veces';
        } else {
            return '404';
        }
    }

    @Get(':link') // Ruta para obtener un link específico
    @Redirect()
    async getLink(
        @Param('link') link: string, @Query('pass') pass: string): Promise<{ url: string }> {
        // Obtenemos el target correspondiente al link
        const currentTarget: string | null = await this.linkService.updateAmount(link, pass);
        if (currentTarget) {
            // Redireccionar hacia currentTarget (Ahi ta la url del destino)
            //NOSE PORQUE PASA DOS VECES POR EL GET, por lo que suma 2 al amount, y aveces suma a otro link (MAL)
            return { url: currentTarget };
        } else {
            // Si no se encuentra el link, devolvemos un error 404
            throw new NotFoundException('404 - Link not found');
        }
    }

    @Put('/invalid/:link')
    async invalidLink(@Param('link') link: string, @Query('pass') pass: string){
        const pLink = await this.linkService.getOneLink(link, pass)
        if (pLink){
            return this.linkService.invalidLink(pLink.link)
        }
        else{
            throw new NotFoundException('404 - Link not found');
        }
        
    }

}
