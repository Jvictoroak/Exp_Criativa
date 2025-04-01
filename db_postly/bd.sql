/* Lógico_1: */

CREATE TABLE usuario (
    id int PRIMARY KEY,
    senha varchar(50),
    data date,
    telefone varchar(20),
    email varchar(50),
    foto blob,
    nome varchar(50)
);

CREATE TABLE publicacao (
    id int PRIMARY KEY,
    titulo varchar(50),
    foto blob,
    descricao varchar(300),
    fk_usuario_id int
);

CREATE TABLE tags (
    nome varchar(50),
    id int PRIMARY KEY
);

CREATE TABLE tem (
    fk_publicacao_id int,
    fk_tags_id int,
    id int PRIMARY KEY
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