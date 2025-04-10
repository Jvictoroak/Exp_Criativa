from fastapi import FastAPI, Form, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
from models import User
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm

pdwb_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
    telefone: str = Form(...),
    foto: UploadFile = File(None),
    data: str = Form(...),
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

    senha_hash = pdwb_context.hash(senha)
    
    # Criar novo usuário
    new_user = User(
        nome=nome,
        email=email,
        senha=senha_hash,
        telefone=telefone,
        foto=foto_blob,
        data=data
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Usuário registrado com sucesso!",
        "user_id": new_user.id
    }


@app.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print(f"Tentativa de login: {form_data.username}")  # Log do nome do usuário
    user = db.query(User).filter(User.nome == form_data.username).first()  # Alterado para verificar pelo nome
    if not user:
        print("Usuário não encontrado.")
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    if not pdwb_context.verify(form_data.password, user.senha):
        print("Senha incorreta.")
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    print("Login bem-sucedido.")
    return {
        "message": "Login realizado com sucesso!",
        "user_id": user.id,
        "nome": user.nome
    }

