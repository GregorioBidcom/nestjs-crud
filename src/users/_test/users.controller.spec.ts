/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Link } from '../user.entity';
import { UsersController } from '../users.controller';
import { createLinkDto } from '../dto/create-link.dto';

describe('UsersService', () => {
  let userService: UsersService;
  let usersController: UsersController;
  let repository: Repository<Link>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Link),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    usersController = module.get<UsersController>(UsersController);
    repository = module.get<Repository<Link>>(getRepositoryToken(Link));
  });
  
  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(usersController).toBeDefined();
  });
    //Leer todos los links
  describe('readLinks', () => {
    it('should return an array of Link', async () => {
      const links = [new Link()];
      jest.spyOn(userService, 'getAllLinks').mockImplementation(async () => links);

      //const result = await userService.getAllLinks();

      expect(await usersController.readLinks()).toBe(links);
      expect(await userService.getAllLinks()).toBe(links);
    });
  });

  describe('createLink', () => {
    it('should create a new link', async () => {
        const linkCreated : createLinkDto = {
            target: "google.com.ar",
            entryAmount: 0,
            link: ""
        }
      //const createLinkDto = { "target": "google.com.ar"};
      const link = new Link();
      jest.spyOn(repository, 'create').mockReturnValue(link);
      jest.spyOn(repository, 'save').mockResolvedValue(link);

      const result = await userService.createLink(linkCreated);

      expect(result).toBe(link);
      expect(repository.create).toHaveBeenCalledWith(linkCreated);
      expect(repository.save).toHaveBeenCalledWith(link);
    });
  });

  //npm test users.controller
  describe('getOneLink', () => {
    it('should return link if found and not expired', async () => {
      const link = 'link';
      const pass = 'pass';
      const linkObj = new Link();
      linkObj.expiredAt	= new Date(Date.now() + 3600000);
      linkObj.link = link
      linkObj.password = pass
      jest.spyOn(repository, 'findOne').mockResolvedValue(linkObj);
  
      const result = await userService.getOneLink(link, pass);
      expect(result).toBe(linkObj); 
    });
  
    it('should return null if link not found', async () => {
      const link = 'link';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
  
      const result = await userService.getOneLink(link);
  
      expect(result).toBe(null);
    });
  });
  

  describe('updateAmount', () => {
    it('should update link entry amount', async () => {

      const linkDto: UpdateResult = null
      const link = 'link';
      const pass = 'password';
      const linkObj = new Link();
      linkObj.valid = 0;
      linkObj.entryAmount = 0;
      jest.spyOn(userService, 'getOneLink').mockResolvedValue(linkObj);
      jest.spyOn(repository, 'update').mockResolvedValue(linkDto );

      const result = await userService.updateAmount(link, pass);

      expect(result).toBe(linkObj.target);
      expect(repository.update).toHaveBeenCalledWith({ link }, { entryAmount: 1 });
    });

    it('should return null if link is invalid', async () => {
      const link = 'link';
      const pass = 'password';
      const linkObj = new Link();
      linkObj.valid = 1;
      jest.spyOn(userService, 'getOneLink').mockResolvedValue(linkObj);

      const result = await userService.updateAmount(link, pass);

      expect(result).toBe(null);
    });

    it('should return null if link not found', async () => {
      const link = 'link';
      jest.spyOn(userService, 'getOneLink').mockResolvedValue(null);

      const result = await userService.updateAmount(link);

      expect(result).toBe(null);
    });
  });

  describe('invalidLink', () => {
    it ('should return a string', () => {
      const link = 'link'
      jest.spyOn(userService, 'invalidLink').mockResolvedValue(link);

      const result = userService.invalidLink(link)
      const result2 = userService.invalidLink(null)

      expect(result).toBe('URL invalidada correctamente');
      expect(result2).toBe('404');
    })
  })
});

