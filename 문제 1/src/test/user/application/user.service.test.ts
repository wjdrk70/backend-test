import {Test, TestingModule} from '@nestjs/testing';
import {UserService} from '@src/user/application/user.service';
import {CreateUserDto} from '@src/user/ui/dto/create.user.dto';
import {User} from '@src/user/domain/user';
import {HttpException} from '@nestjs/common';
import {DataSource, Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {IsolationLevel} from "typeorm/driver/types/IsolationLevel";
jest.mock('argon2', () => ({
    hash: jest.fn(),
    verify: jest.fn(),
}));

const argon = require('argon2');

describe('UserService Test', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<Repository<User>>;
    let dataSource: jest.Mocked<DataSource>;


    beforeEach(async () => {

        const mockUserRepository = {
            create: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
        };

        const mockDataSource = {
            transaction: jest.fn(),
        };

        jest.mock('argon2', () => ({
            hash: jest.fn(),
            verify: jest.fn(),
        }));



        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                }



            ]
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
        dataSource = module.get<DataSource>(DataSource) as jest.Mocked<DataSource>;

        jest.clearAllMocks();

    });


    describe('회원가입', () => {
        it('유효한 사용자 정보를 받으면 사용자를 생성하고 ID가 포함된 사용자 정보를 반환해야 한다', async () => {

            // Given: 유효한 사용자 등록 정보
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'securePassword123',
            };

            const createdAt = new Date();
            const expectedUser: Partial<User> = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                createdAt,
            };
            const hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$hashedPasswordValue';

            // argon.hash 모의 설정
            argon.hash.mockResolvedValue(hashedPassword);

            const mockManager = {
                findOneBy: jest.fn().mockResolvedValue(null),
                save: jest.fn().mockResolvedValue(expectedUser),
            };

            dataSource.transaction.mockImplementation((isolationOrCb: IsolationLevel | Function, cb?: Function) => {
                const callback = typeof isolationOrCb === 'function' ? isolationOrCb : cb;
                return callback(mockManager);
            });


            userRepository.create.mockImplementation((dto) => {
                return {
                    ...dto,
                    id: 1,
                    createdAt
                } as User;
            });


            // Then
            const result = await userService.register(createUserDto);


            expect(dataSource.transaction).toHaveBeenCalled();
            expect(mockManager.findOneBy).toHaveBeenCalledWith(User, {email: 'john@example.com'});
            expect(argon.hash).toHaveBeenCalledWith('securePassword123');

            // create가 호출될 때 비밀번호가 해시된 값을 가지고 있는지 확인
            const createCall = userRepository.create.mock.calls[0][0];
            expect(createCall.password).toBe(hashedPassword);

            expect(mockManager.save).toHaveBeenCalled();
            expect(result).toEqual(expectedUser);
        });

        it('이미 존재하는 이메일로 가입 시도 시 409 충돌 에러를 반환해야 한다', async () => {
            // Given: 이미 존재하는 이메일로 가입 시도
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'existing@example.com',
                password: 'securePassword123',
            };

            const existingUser: Partial<User> = {
                id: 1,
                name: 'Existing User',
                email: 'existing@example.com',
            };
            const mockManager = {
                findOneBy: jest.fn().mockResolvedValue(existingUser), // 이미 존재하는 사용자 반환
                save: jest.fn(),
            };

            // mock 설정
            dataSource.transaction.mockImplementation((isolationOrCb: IsolationLevel | Function, cb?: Function) => {
                const callback = typeof isolationOrCb === 'function' ? isolationOrCb : cb;
                return callback(mockManager);
            });

            // When & Then: 409 에러가 발생하는지 확인
            await expect(userService.register(createUserDto)).rejects.toThrow(HttpException);
            await expect(userService.register(createUserDto)).rejects.toThrow('Email already exists');
            // 에러의 상태 코드와, 메시지를 자세히 검증
            try {
                await userService.register(createUserDto);
            } catch (error) {

                const response = error.getResponse();


                expect(response).toEqual({
                    statusCode: 409,
                    message: 'Email already exists'
                });
            }

            // 트랜잭션과 findOneBy가 호출되었는지 확인
            expect(dataSource.transaction).toHaveBeenCalled();
            expect(mockManager.findOneBy).toHaveBeenCalledWith(User, {email: 'existing@example.com'});
            // save는 호출되지 않아야 함 (에러가 발생했으므로)
            expect(mockManager.save).not.toHaveBeenCalled();

        });

        it('유효하지 않은 이메일 형식으로 가입 시도 시 400 에러를 반환해야 한다', async () => {
            // Given: 유효하지 않은 이메일 형식으로 가입 시도
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'invalid-email',
                password: 'securePassword123',
            };


            const validateEmail = (email: string): boolean => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            };

            expect(validateEmail(createUserDto.email)).toBe(false);
        });

        it('유효하지 않은 비밀번호로 가입 시도 시 400 에러와 커스텀 메시지를 반환해야 한다', async () => {
            // Given: 유효하지 않은 비밀번호(숫자 없음)로 가입 시도
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'nodigits', // 숫자가 없는 비밀번호
            };

            const mockManager = {
                findOneBy: jest.fn().mockResolvedValue(null), // 중복된 사용자 없음
                save: jest.fn(),
            };

            // mock 설정
            dataSource.transaction.mockImplementation((isolationOrCb: IsolationLevel | Function, cb?: Function) => {
                const callback = typeof isolationOrCb === 'function' ? isolationOrCb : cb;
                return callback(mockManager);
            });

            // When & Then: 400 에러가 발생하는지 확인
            await expect(userService.register(createUserDto)).rejects.toThrow(HttpException);
            await expect(userService.register(createUserDto)).rejects.toThrow('Password must be at least 8 characters long');

            // 에러의 상태 코드와 메시지를 자세히 검증
            try {
                await userService.register(createUserDto);
            } catch (error) {
                const response = error.getResponse();

                expect(response).toEqual({
                    statusCode: 400,
                    message: 'Password must be at least 8 characters long'
                });
            }

            // 트랜잭션과 findOneBy가 호출되었는지 확인
            expect(dataSource.transaction).toHaveBeenCalled();
            expect(mockManager.findOneBy).toHaveBeenCalledWith(User, {email: 'john@example.com'});
            // save는 호출되지 않아야 함 (에러가 발생했으므로)
            expect(mockManager.save).not.toHaveBeenCalled();
        });

    });
});