import {Module} from "@nestjs/common";
import {UserController} from "@src/user/ui/user.controller";
import {UserService} from "@src/user/application/user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@src/user/domain/user";


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})

export class UserModule {}