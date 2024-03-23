create database templater
    with owner apps;

comment on database templater is 'Основная БД проекта';


create table public.users
(
    id       integer not null,
    password varchar,
    email    varchar not null
);

comment on table public.users is 'Пользователи';

alter table public.users
    owner to apps;

create table public.documents
(
    id            integer,
    user_id       integer
        constraint documents_users_id_fk
            references public.users (id),
    documetn_name varchar
);

comment on table public.documents is 'Список документов пользователя';


create table public.templ_props
(
    id          integer
        constraint templ_props_pk
            primary key,
    document_id integer,
    props       jsonb
);

comment on table public.templ_props is 'Наборы полей для шаблонизации';
