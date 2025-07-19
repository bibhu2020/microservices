import { Controller, Param, Get, Post, Put, Delete, Patch, 
    Body, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {} //by doing this, it pulls in the UsersService that was injected into the module. You do not need to create another instance. It ensures only one object is created for the class.

    @Get() //Get /users
    findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        return this.usersService.findAll(role)
    }
    @Get(':id') //Get /users/:id
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id)
        //the + sign converts the string to a number
    }
    @Post() //Post /users
    create(@Body(ValidationPipe) user: CreateUserDto) {
        return this.usersService.create(user)
    }
    @Put(':id') //Put /users/:id
    update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) user: UpdateUserDto) {
        return this.usersService.update(id, user)
    }
    @Delete(':id') //Delete /users/:id
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.delete(id)
    }
    @Patch(':id') //Patch /users/:id
    partialUpdate(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) user: UpdateUserDto) {
        return {...this.usersService.update(id, user)};
    }
}