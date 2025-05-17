DROP DATABASE IF EXISTS postly_db;
CREATE DATABASE postly_db;
USE postly_db;

/* Lógico_1: */

CREATE TABLE usuario (
    id int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(50),
    email varchar(50),
    senha varchar(255),
    telefone varchar(20),
    data date,
    foto longblob,
    admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE publicacao (
    id int PRIMARY KEY AUTO_INCREMENT,
    fk_usuario_id int,
    titulo varchar(50),
    descricao varchar(300),
    foto longblob
);

CREATE TABLE tags (
    id int PRIMARY KEY AUTO_INCREMENT,
    nome varchar(50)
);

CREATE TABLE tem (
    id int PRIMARY KEY AUTO_INCREMENT,
    fk_publicacao_id int,
    fk_tags_id int
);

ALTER TABLE publicacao ADD CONSTRAINT FK_publicacao_2
    FOREIGN KEY (fk_usuario_id)
    REFERENCES usuario (id)
    ON DELETE CASCADE;

ALTER TABLE tem ADD CONSTRAINT FK_tem_2
    FOREIGN KEY (fk_publicacao_id)
    REFERENCES publicacao (id)
    ON DELETE SET NULL;

ALTER TABLE tem ADD CONSTRAINT FK_tem_3
    FOREIGN KEY (fk_tags_id)
    REFERENCES tags (id)
    ON DELETE SET NULL;

INSERT INTO usuario (nome, email, senha, telefone, data, admin) VALUES ('AdminPostly', 'adminpostly@email.com', MD5('P@ssw0rd_postly'), '00000000000', '1900-01-01', TRUE);
INSERT INTO tags (nome) VALUES ('Tag1');
INSERT INTO tags (nome) VALUES ('Tag2');
INSERT INTO tags (nome) VALUES ('Tag3');
INSERT INTO tags (nome) VALUES ('Tag4');