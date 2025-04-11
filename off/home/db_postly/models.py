from sqlalchemy import Column, Integer, String, Date, ForeignKey, BLOB
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    senha = Column(String(50), nullable=False)
    data = Column(Date, nullable=True)
    telefone = Column(String(20), nullable=True)
    email = Column(String(50), unique=True, nullable=False)
    foto = Column(BLOB, nullable=True)
    nome = Column(String(50), nullable=False)

    publicacoes = relationship("Publicacao", back_populates="usuario", cascade="all, delete")


class Publicacao(Base):
    __tablename__ = "publicacao"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    titulo = Column(String(50), nullable=False)
    foto = Column(BLOB, nullable=True)
    descricao = Column(String(300), nullable=True)
    fk_usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)

    usuario = relationship("User", back_populates="publicacoes")
    tags = relationship("Tem", back_populates="publicacao", cascade="all, delete-orphan")


class Tags(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(50), nullable=False)

    publicacoes = relationship("Tem", back_populates="tag", cascade="all, delete-orphan")


class Tem(Base):
    __tablename__ = "tem"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fk_publicacao_id = Column(Integer, ForeignKey("publicacao.id", ondelete="SET NULL"), nullable=True)
    fk_tags_id = Column(Integer, ForeignKey("tags.id", ondelete="SET NULL"), nullable=True)

    publicacao = relationship("Publicacao", back_populates="tags")
    tag = relationship("Tags", back_populates="publicacoes")