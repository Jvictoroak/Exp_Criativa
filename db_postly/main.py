from fastapi import FastAPI, Form, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
from models import User

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register_user(
    nome: str = Form(...),
    email: str = Form(...),
    senha: str = Form(...),
    telefone: str = Form(None),
    foto: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Verificar se o e-mail já existe
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="E-mail já está em uso.")

    # Processar a foto (se fornecida)
    foto_blob = None
    if foto:
        foto_blob = foto.file.read()

    # Criar novo usuário
    new_user = User(
        nome=nome,
        email=email,
        senha=senha,
        telefone=telefone,
        foto=foto_blob
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Usuário registrado com sucesso!",
        "user_id": new_user.id
    }
