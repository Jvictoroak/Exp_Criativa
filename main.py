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
import base64
import imghdr

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

@app.get("/logout")
async def logout(request: Request):
    request.session.clear()  # Limpa a sessão do usuário
    return RedirectResponse(url="/login", status_code=303)

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
            return templates.TemplateResponse(
                "login.html",
                {"request": request, "sucesso": "Login realizado com sucesso!"}
            )
        else:
            # Credenciais inválidas
            return templates.TemplateResponse(
                "login.html",
                {"request": request, "erro": "Nome de usuário ou senha incorretos."}
            )

    except Exception as e:
        return templates.TemplateResponse(
            "login.html",
            {"request": request, "erro": "Erro ao autenticar usuário."}
        )
    finally:
        cursor.close()
        conn.close()

def login_required(request: Request):
    if not request.session.get('user_id'):
        return RedirectResponse(url="/login", status_code=303)

@app.post("/login", response_class=HTMLResponse)
async def authenticate_user(
    request: Request,
    usuario: str = Form(...),
    senha: str = Form(...)
):
    conn = get_db()
    cursor = conn.cursor()

    try:
        senha_md5 = hashlib.md5(senha.encode()).hexdigest()
        query = "SELECT id, nome FROM usuario WHERE nome = %s AND senha = %s"
        cursor.execute(query, (usuario, senha_md5))
        user = cursor.fetchone()

        if user:
            # Armazenar dados do usuário na sessão
            request.session['user_id'] = user[0]
            request.session['user_name'] = user[1]
            return RedirectResponse(url="/perfil", status_code=303)
        else:
            return templates.TemplateResponse(
                "login.html",
                {"request": request, "erro": "Nome de usuário ou senha incorretos."}
            )
    finally:
        cursor.close()
        conn.close()

@app.get("/perfil", response_class=HTMLResponse)
async def get_perfil_page(request: Request):
    user_id = request.session.get('user_id')
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)

    conn = get_db()
    cursor = conn.cursor()

    try:
        query = "SELECT nome, email, telefone, data, foto FROM usuario WHERE id = %s"
        cursor.execute(query, (int(user_id),))
        user_data = cursor.fetchone()

        if user_data:
            foto_base64 = None
            foto_tipo = None

            if user_data[4]:  # Se a foto existir
                foto_blob = user_data[4]
                tipo = imghdr.what(None, h=foto_blob)
                if tipo:
                    foto_tipo = f"image/{tipo}"
                else:
                    foto_tipo = "image/jpeg"  # padrão se não detectar

                foto_base64 = base64.b64encode(foto_blob).decode('utf-8')

            return templates.TemplateResponse(
                "perfil.html",
                {
                    "request": request,
                    "nome": user_data[0],
                    "email": user_data[1],
                    "telefone": user_data[2],
                    "data_nascimento": user_data[3],
                    "foto_base64": foto_base64,
                    "foto_tipo": foto_tipo,
                }
            )
        else:
            return RedirectResponse(url="/login", status_code=303)

    finally:
        cursor.close()
        conn.close()

@app.post("/perfilExcluir", response_class=HTMLResponse)
async def delete_user(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)

    conn = get_db()
    cursor = conn.cursor()

    try:
        query = "DELETE FROM usuario WHERE id = %s"
        cursor.execute(query, (user_id,))
        conn.commit()

        request.session.clear()  # Limpa a sessão após exclusão do usuário
        return RedirectResponse(url="/login", status_code=303)

    except Exception as e:
        return templates.TemplateResponse(
            "perfil.html",
            {"request": request, "erro": f"Erro ao excluir usuário: {str(e)}"}
        )
    finally:
        cursor.close()
        conn.close()

@app.get("/perfil", response_class=HTMLResponse)
async def perfil_atualizar(request: Request, db=Depends(get_db)):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)

    with db.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("SELECT * FROM usuario WHERE id = %s", (user_id,))
        usuario = cursor.fetchone()
    db.close()

    hoje = datetime.now().strftime("%d/%m/%Y %H:%M")

    return templates.TemplateResponse("perfilAtualizar.html", {
        "request": request,
        "usuario": usuario,
        "hoje": hoje
    })

@app.post("/perfilAtualizar", response_class=HTMLResponse)
async def perfil_atualizar_exe(
    request: Request,
    Nome: str = Form(...),
    Email: str = Form(...),
    Telefone: str = Form(...),
    DataNasc: str = Form(None),
    Imagem: UploadFile = File(None),
    db=Depends(get_db)
):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)

    foto_bytes = None
    if Imagem and Imagem.filename:
        foto_bytes = await Imagem.read()

    try:
        with db.cursor() as cursor:
            if foto_bytes:
                sql = """UPDATE usuario 
                         SET nome=%s, email=%s, telefone=%s, data=%s, foto=%s
                         WHERE id=%s"""
                cursor.execute(sql, (Nome, Email, Telefone, DataNasc, foto_bytes, user_id))
            else:
                sql = """UPDATE usuario 
                         SET nome=%s, email=%s, telefone=%s, data=%s
                         WHERE id=%s"""
                cursor.execute(sql, (Nome, Email, Telefone, DataNasc, user_id))
            db.commit()

        request.session["mensagem_header"] = "Atualização de Perfil"
        request.session["mensagem"] = "Perfil atualizado com sucesso!"

    except Exception as e:
        request.session["mensagem_header"] = "Erro ao atualizar"
        request.session["mensagem"] = str(e)
    finally:
        db.close()

    return RedirectResponse(url="/perfil", status_code=303)

@app.post("/perfil")
async def perfil_atualizar_exe(
    request: Request,
    Nome: str = Form(...),
    Email: str = Form(...),
    Telefone: str = Form(...),
    DataNasc: str = Form(None),
    Imagem: UploadFile = File(None),
    db=Depends(get_db)
):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)

    foto_bytes = None
    if Imagem and Imagem.filename:
        foto_bytes = await Imagem.read()

    try:
        with db.cursor() as cursor:
            if foto_bytes:
                sql = """UPDATE usuario 
                         SET nome=%s, email=%s, telefone=%s, data=%s, foto=%s
                         WHERE id=%s"""
                cursor.execute(sql, (Nome, Email, Telefone, DataNasc, foto_bytes, user_id))
            else:
                sql = """UPDATE usuario 
                         SET nome=%s, email=%s, telefone=%s, data=%s
                         WHERE id=%s"""
                cursor.execute(sql, (Nome, Email, Telefone, DataNasc, user_id))
            db.commit()

        request.session["mensagem_header"] = "Atualização de Perfil"
        request.session["mensagem"] = "Perfil atualizado com sucesso!"

    except Exception as e:
        request.session["mensagem_header"] = "Erro ao atualizar"
        request.session["mensagem"] = str(e)
    finally:
        db.close()

    return templates.TemplateResponse("perfilAtualizar_exe.html", {
        "request": request,
        "mensagem_header": request.session.get("mensagem_header", ""),
        "mensagem": request.session.get("mensagem", ""),
        "hoje": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "nome_usuario": request.session.get("user_name", None)
    })
