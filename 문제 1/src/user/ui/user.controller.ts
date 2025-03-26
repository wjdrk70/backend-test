import  {CreateUserDto} from "@src/user/ui/dto/create.user.dto";
import {Controller, Post, Get, Body} from "@nestjs/common";
import {User} from "@src/user/domain/user";
import {UserService} from "@src/user/application/user.service";
import {UserResponseDto} from "@src/user/ui/dto/user.response.dto";

@Controller('users')
export class UserController {
constructor(private readonly userService:UserService) {
}
    @Post()
    async create(@Body() createUserDto: CreateUserDto):Promise<UserResponseDto> {
    console.log(createUserDto);


        return this.userService.register(createUserDto);
    }
}