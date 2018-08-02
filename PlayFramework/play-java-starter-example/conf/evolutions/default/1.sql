# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table user_model (
  id                            integer auto_increment not null,
  user_name                     varchar(255),
  pass_word                     varchar(255),
  constraint pk_user_model primary key (id)
);


# --- !Downs

drop table if exists user_model;

