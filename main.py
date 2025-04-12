import pymysql
import base64
import hashlib
import re

from mangum import Mangum
from fastapi import FastAPI, Request, Form, Depends, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from datetime import date, datetime


app = FastAPI()

# Configuração de sessão (chave secreta para cookies de sessão)
app.add_middleware(SessionMiddleware, secret_key="postly")

# Configuração de arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuração de templates Jinja2
templates = Jinja2Templates(directory="templates")

# Configuração do banco de dados
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "postly",
    "database": "postly_db"
}

# Função para obter conexão com MySQL
def get_db():
    return pymysql.connect(**DB_CONFIG)

@app.get("/register", response_class=HTMLResponse)
async def get_register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def get_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/register")
async def register_user(
    usuario: str = Form(...),
    telefone: str = Form(...),
    senha: str = Form(...),
    confirmar_senha: str = Form(...),
    email: str = Form(...),
    nascimento: str = Form(...),
    foto: UploadFile = File(None)
):
    print("Requisição recebida no /register")
    if senha != confirmar_senha:
        raise HTTPException(status_code=400, detail="As senhas não coincidem.")
    
       # Remover máscara do telefone
    telefone = re.sub(r'\D', '', telefone)  # Remove todos os caracteres não numéricos

    # Criptografar a senha em MD5
    senha_md5 = hashlib.md5(senha.encode()).hexdigest()

    # Conexão com o banco de dados
    conn = get_db()
    print("Conexão com o banco de dados bem-sucedida!")
    cursor = conn.cursor()

    try:
        # Inserir os dados no banco
        query = """
        INSERT INTO usuario (senha, data, telefone, email, foto, nome)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        foto_data = foto.file.read() if foto else None
        cursor.execute(query, (senha_md5, nascimento, telefone, email, foto_data, usuario))
        conn.commit()

        print("Usuário registrado com sucesso!")
        # Redirecionar para a página de login
        return RedirectResponse(url="/login", status_code=303)

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Erro ao registrar usuário.")
    finally:
        cursor.close()
        conn.close()
