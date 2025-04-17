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

@app.get("/index", response_class=HTMLResponse)
async def get_index_page(request: Request):
    login_required(request)
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/register", response_class=HTMLResponse)
async def register_user(
    request: Request,
    usuario: str = Form(...),
    telefone: str = Form(...),
    senha: str = Form(...),
    confirmar_senha: str = Form(...),
    email: str = Form(...),
    nascimento: str = Form(...),
    foto: UploadFile = File(None)
):
    # Validação no backend
    if len(usuario) < 3 or len(usuario) > 20:
        return templates.TemplateResponse("register.html", {"request": request, "erro": "O nome de usuário deve ter entre 3 e 20 caracteres."})
    if not re.match(r"^\(\d{2}\) \d{4,5}-\d{4}$", telefone):
        return templates.TemplateResponse("register.html", {"request": request, "erro": "O telefone deve estar no formato (XX) XXXXX-XXXX."})
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        return templates.TemplateResponse("register.html", {"request": request, "erro": "O e-mail fornecido é inválido."})
    if senha != confirmar_senha:
        return templates.TemplateResponse("register.html", {"request": request, "erro": "As senhas não coincidem."})
    if not re.match(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$", senha):
        return templates.TemplateResponse("register.html", {"request": request, "erro": "A senha deve conter entre 8 e 20 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial."})
    try:
        nascimento_date = datetime.strptime(nascimento, "%Y-%m-%d").date()
        if nascimento_date > date.today():
            return templates.TemplateResponse("register.html", {"request": request, "erro": "A data de nascimento não pode ser no futuro."})
    except ValueError:
        return templates.TemplateResponse("register.html", {"request": request, "erro": "A data de nascimento é inválida."})

    # Remover máscara do telefone
    telefone = re.sub(r'\D', '', telefone)

    # Criptografar a senha em MD5
    senha_md5 = hashlib.md5(senha.encode()).hexdigest()

    # Conexão com o banco de dados
    conn = get_db()
    cursor = conn.cursor()

    try:
        # Inserir os dados no banco
        query = """
        INSERT INTO usuario (nome, email, senha, telefone, data, foto)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        foto_data = foto.file.read() if foto else None
        cursor.execute(query, (usuario, email, senha_md5, telefone, nascimento, foto_data))
        conn.commit()

        # Retornar a página de registro com mensagem de sucesso
        return templates.TemplateResponse("register.html", {"request": request, "sucesso": "Cadastro realizado com sucesso! Faça login para continuar."})

    except Exception as e:
        conn.rollback()
        return templates.TemplateResponse("register.html", {"request": request, "erro": "Erro ao registrar usuário."})
    finally:
        cursor.close()
        conn.close()

@app.post("/login", response_class=HTMLResponse)
async def authenticate_user(
    request: Request,
    usuario: str = Form(...),
    senha: str = Form(...)
):
    # Conexão com o banco de dados
    conn = get_db()
    cursor = conn.cursor()

    try:
        # Criptografar a senha fornecida pelo usuário
        senha_md5 = hashlib.md5(senha.encode()).hexdigest()

        # Consultar o banco de dados para verificar as credenciais
        query = "SELECT id, nome FROM usuario WHERE nome = %s AND senha = %s"
        cursor.execute(query, (usuario, senha_md5))
        user = cursor.fetchone()

        if user:
            # Autenticação bem-sucedida
            request.session['user_id'] = user[0]
            request.session['user_name'] = user[1]
            return RedirectResponse(url="/index", status_code=303)
        else:
            # Credenciais inválidas
            return templates.TemplateResponse("login.html", {"request": request, "erro": "Nome de usuário ou senha incorretos."})

    except Exception as e:
        return templates.TemplateResponse("login.html", {"request": request, "erro": "Erro ao autenticar usuário."})
    finally:
        cursor.close()
        conn.close()

def login_required(request: Request):
    if not request.session.get('user_id'):
        return RedirectResponse(url="/login", status_code=303)