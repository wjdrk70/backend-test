import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@src/user/domain/user";
import {DataSource, Repository} from "typeorm";
import {CreateUserDto} from "@src/user/ui/dto/create.user.dto";
import * as argon from 'argon2';
import {UserResponseDto} from "@src/user/ui/dto/user.response.dto";
import {plainToClass} from "class-transformer";


@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                private dataSource: DataSource,
    ) {

    }

    private async derivePassphrase(passphrase: string): Promise<string> {

        return await argon.hash(passphrase);
    }


    private validatePassword(password: string): void {
        if (password.length < 8 || !password.match(/\d/) || !password.match(/[a-zA-Z]/)) {

            throw new HttpException({
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Password must be at least 8 characters long"
                },
                HttpStatus.BAD_REQUEST)
        }

    }


    async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const savedUser = await this.dataSource.transaction(async manager => {

            const existingUser = await manager.findOneBy(User, {
                email: createUserDto.email
            });


            if (existingUser) {
                throw new HttpException({statusCode: HttpStatus.CONFLICT, message: "Email already exists"},
                    HttpStatus.CONFLICT)
            }
            this.validatePassword(createUserDto.password);

            const hashPassword = await this.derivePassphrase(createUserDto.password)
            const userToCreate = {
                ...createUserDto,
                password: hashPassword
            };

            const user = this.userRepository.create(userToCreate);

            return await manager.save(user);
        });

        return plainToClass(UserResponseDto, savedUser, { excludeExtraneousValues: true });
    }
}