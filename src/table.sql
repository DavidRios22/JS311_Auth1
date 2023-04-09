create table regUsers (
    id int primary key auto_increment,
    username varchar(50) not null,
    passworkd_hash varchar (1000) not null,
    full_name varchar(100) not null
)