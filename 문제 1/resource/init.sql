CREATE TABLE users
(
    id         int auto_increment
        primary key,
    name       varchar(50)  not null,
    email      varchar(100) not null,
    password   varchar(100) not null,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP null
);