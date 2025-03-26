import {Module} from '@nestjs/common';
import {UserModule} from "@src/user/user.module";
import {DataSource} from "typeorm";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ScryptModule} from "@coniface/nestjs-scrypt";
import * as os from "node:os";
import {User} from "@src/user/domain/user";

@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'guest',
        password: 'mypassword',
        database: 'example',
        entities: [
        User
        ],
        synchronize: false,

    }),

        UserModule]

})
export class AppModule {
    constructor(private dataSource: DataSource) {
    }
}
