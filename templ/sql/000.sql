create database templater
    with owner apps;

comment on database templater is 'Основная БД проекта';


create table "user"
(
    id          serial
        constraint user_pk
            primary key,
    email       varchar,
    password    varchar,
    create_date date,
    active      boolean
);

comment on table "user" is 'Список пользователей';

alter table "user"
    owner to apps;


create table documents
(
    id            serial
        constraint documents_pk
            primary key,
    user_id       integer
        constraint documents_user_id_fk
            references "user",
    filename_orig varchar,
    filename      varchar,
    create_date   date
);

comment on table documents is 'Список загруженных шаблонов';

alter table documents
    owner to apps;

create table doc_props
(
    id          serial
        constraint doc_props_pk
            primary key,
    document_id integer
        constraint doc_props_documents_id_fk
            references documents,
    data        varchar,
    user_id     integer
        constraint doc_props_user_id_fk
            references "user",
    create_date date
);

comment on table doc_props is 'Структура параметров для шаблонизации';

alter table doc_props
    owner to apps;

    create table access
(
    id          serial
        constraint access_pk
            primary key,
    user_id     integer
        constraint access_user_id_fk
            references "user",
    code        varchar,
    create_date date
);

alter table access
    owner to apps;