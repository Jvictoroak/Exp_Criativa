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

from typing import List

app = FastAPI()

# Configuração de sessão (chave secreta para cookies de sessão)
app.add_middleware(SessionMiddleware, secret_key="postly")

# Configuração de arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuração de templates Jinja2
templates = Jinja2Templates(directory="templates")

# Registrar o filtro b64encode no Jinja2
def b64encode_filter(data):
    if data:
        return base64.b64encode(data).decode('utf-8')
    return None

templates.env.filters['b64encode'] = b64encode_filter

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

#-------------------------------------------------------------------------------------------------------------
#ENDEREÇOS URL
@app.get("/", response_class=RedirectResponse)
async def root():
    return RedirectResponse(url="/login")

@app.get("/register", response_class=HTMLResponse)
async def get_register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
async def get_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# @app.get("/index", response_class=HTMLResponse)
# async def get_index_page(request: Request):
#     login_required(request)
#     return templates.TemplateResponse("index.html", {"request": request})
@app.get("/index", response_class=HTMLResponse)
async def index(request: Request):
    # Verifica se o usuário está logado
    if not request.session.get('user_id'):
        return RedirectResponse(url="/login", status_code=303)
    
    # Busca as tags no banco
    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT id, nome FROM tags")
    tags = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # Passa as tags para o template
    return templates.TemplateResponse("index.html", {"request": request, "tags": tags})

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
    
    # Conexão com o banco de dados
    conn = get_db()
    cursor = conn.cursor()

    try:
        # Verificar se o nome de usuário já existe
        query = "SELECT COUNT(*) FROM usuario WHERE nome = %s"
        cursor.execute(query, (usuario))
        if cursor.fetchone()[0] > 0:
            return templates.TemplateResponse("register.html", {"request": request, "erro": "Nome de usuário já existe."})
    except Exception as e:
        return templates.TemplateResponse("register.html", {"request": request, "erro": "Erro ao verificar usuário."})
    
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
    finally:
        cursor.close()
        conn.close()

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

            # Verificar se é o administrador
            if usuario == "AdminPostly" and senha == "P@ssw0rd_postly":
                return RedirectResponse(url="/lista_usuarios", status_code=303)

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

#-------------------------------------------------------------------------------------------------------------


def login_required(request: Request):
    if not request.session.get('user_id'):
        return RedirectResponse(url="/login", status_code=303)

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
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        # Dados do usuário
        cursor.execute("SELECT nome, email, telefone, data, foto FROM usuario WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()

        # Publicações do usuário (corrigido: só do usuário logado)
        cursor.execute("SELECT id, titulo, descricao, foto FROM publicacao WHERE fk_usuario_id = %s ORDER BY id DESC", (user_id,))
        publicacoes = cursor.fetchall()
        for pub in publicacoes:
            if pub["foto"]:
                pub["foto_base64"] = base64.b64encode(pub["foto"]).decode("utf-8")
            else:
                pub["foto_base64"] = None

        # Foto do perfil
        foto_base64 = None
        foto_tipo = None
        if user_data and user_data["foto"]:
            tipo = imghdr.what(None, h=user_data["foto"])
            foto_tipo = f"image/{tipo}" if tipo else "image/jpeg"
            foto_base64 = base64.b64encode(user_data["foto"]).decode('utf-8')

        return templates.TemplateResponse(
            "perfil.html",
            {
                "request": request,
                "nome": user_data["nome"] if user_data else "",
                "email": user_data["email"] if user_data else "",
                "telefone": user_data["telefone"] if user_data else "",
                "data_nascimento": user_data["data"] if user_data else "",
                "foto_base64": foto_base64,
                "foto_tipo": foto_tipo,
                "publicacoes": publicacoes
            }
        )

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

# @app.get("/perfil", response_class=HTMLResponse)
# async def perfil_atualizar(request: Request, db=Depends(get_db)):
#     user_id = request.session.get("user_id")
#     if not user_id:
#         return RedirectResponse(url="/login", status_code=303)

#     with db.cursor(pymysql.cursors.DictCursor) as cursor:
#         cursor.execute("SELECT * FROM usuario WHERE id = %s", (user_id,))
#         usuario = cursor.fetchone()
#     db.close()

#     hoje = datetime.now().strftime("%d/%m/%Y %H:%M")

#     return templates.TemplateResponse("perfilAtualizar.html", {
#         "request": request,
#         "usuario": usuario,
#         "hoje": hoje
#     })

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

    # Remover máscara do telefone
    Telefone = re.sub(r'\D', '', Telefone)

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
    # Substitua a rota GET /perfil por esta versão:
@app.get("/perfil", response_class=HTMLResponse)
async def get_perfil_page(request: Request):
    user_id = request.session.get('user_id')
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)
    
    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        # Dados do usuário
        cursor.execute("SELECT nome, email, telefone, data, foto FROM usuario WHERE id = %s", (user_id,))
        user_data = cursor.fetchone()

        # Publicações do usuário
        cursor.execute("SELECT id, titulo, descricao, foto FROM publicacao ORDER BY id DESC")
        publicacoes = cursor.fetchall()
        for pub in publicacoes:
            if pub["foto"]:
                pub["foto_base64"] = base64.b64encode(pub["foto"]).decode("utf-8")
            else:
                pub["foto_base64"] = None

        # Foto do perfil
        foto_base64 = None
        foto_tipo = None
        if user_data and user_data["foto"]:
            tipo = imghdr.what(None, h=user_data["foto"])
            foto_tipo = f"image/{tipo}" if tipo else "image/jpeg"
            foto_base64 = base64.b64encode(user_data["foto"]).decode('utf-8')

        return templates.TemplateResponse(
            "perfil.html",
            {
                "request": request,
                "nome": user_data["nome"] if user_data else "",
                "email": user_data["email"] if user_data else "",
                "telefone": user_data["telefone"] if user_data else "",
                "data_nascimento": user_data["data"] if user_data else "",
                "foto_base64": foto_base64,
                "foto_tipo": foto_tipo,
                "publicacoes": publicacoes
            }
        )

    finally:
        cursor.close()
        conn.close()
#-------------------------------------------------------------------------------------------------------------
#LISTA DE USUÁRIOS
#   Verificando se o ID do usuário é 1 (administrador)
def verificacao_admin(request: Request):
    id_usuario = request.session.get("user_id")
    return id_usuario == 1

@app.get("/lista_usuarios", response_class=HTMLResponse)
async def lista_usuarios(request: Request):
    if not verificacao_admin(request):
        return templates.TemplateResponse(
            "login.html",
            {"request": request, "erro": "Acesso negado. Você não tem permissão para acessar esta página."}
        )

    conn = get_db()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        query = "SELECT id, nome, email, telefone, data, foto FROM usuario"
        cursor.execute(query)
        usuarios = cursor.fetchall()

        return templates.TemplateResponse("lista_usuarios.html", {
            "request": request,
            "usuarios": usuarios
        })
    finally:
        cursor.close()
        conn.close()

@app.post("/salvar_usuario")
async def salvar_usuario(
    request: Request,
    id: int = Form(...),
    nome: str = Form(...),
    email: str = Form(...),
    telefone: str = Form(...),
    data: str = Form(...)
):
    # Remover máscara do telefone
    telefone = re.sub(r'\D', '', telefone)

    conn = get_db()
    cursor = conn.cursor()

    try:
        query = """
        UPDATE usuario
        SET nome = %s, email = %s, telefone = %s, data = %s
        WHERE id = %s
        """
        cursor.execute(query, (nome, email, telefone, data, id))
        conn.commit()
        return RedirectResponse(url="/lista_usuarios", status_code=303)
    finally:
        cursor.close()
        conn.close()

@app.post("/excluir_usuario")
async def excluir_usuario(request: Request, id: int = Form(...)):
    conn = get_db()
    cursor = conn.cursor()

    try:
        query = "DELETE FROM usuario WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        return RedirectResponse(url="/lista_usuarios", status_code=303)
    finally:
        cursor.close()
        conn.close()

@app.post("/publicar", response_class=HTMLResponse)
async def publicar(
    request: Request,
    titulo: str = Form(...),
    descricao: str = Form(...),
    foto: UploadFile = File(...),
    tags: List[str] = Form(None)
):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)

    conn = get_db()
    cursor = conn.cursor()
    try:
        # Corrigir: ler os bytes da foto
        foto_bytes = await foto.read() if foto else None

        # 1. Insere a publicação
        query = """
        INSERT INTO publicacao (fk_usuario_id, titulo, descricao, foto)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, titulo, descricao, foto_bytes))
        publicacao_id = cursor.lastrowid

        # 2. Relaciona as tags (se houver)
        if tags:
            if isinstance(tags, str):
                tags = [tags]
            for tag_id in tags:
                cursor.execute(
                    "INSERT INTO tem (fk_publicacao_id, fk_tags_id) VALUES (%s, %s)",
                    (publicacao_id, tag_id)
                )
        conn.commit()
        return RedirectResponse(url="/perfil", status_code=303)
    finally:
        cursor.close()
        conn.close()





@app.post("/alterarSenha", response_class=HTMLResponse)
async def alterar_senha(
    request: Request,
    senha_atual: str = Form(...),
    nova_senha: str = Form(...),
    confirmar_senha: str = Form(...)
):
    user_id = request.session.get("user_id")
    if not user_id:
        return RedirectResponse(url="/login", status_code=303)

    # Validação de senha
    if nova_senha != confirmar_senha:
        request.session["mensagem_header"] = "Erro ao alterar senha"
        request.session["mensagem"] = "As senhas não coincidem."
        return RedirectResponse(url="/perfil", status_code=303)
    if not re.match(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$", nova_senha):
        request.session["mensagem_header"] = "Erro ao alterar senha"
        request.session["mensagem"] = "A senha deve conter entre 8 e 20 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial."
        return RedirectResponse(url="/perfil", status_code=303)

    conn = get_db()
    cursor = conn.cursor()
    try:
        # Verifica a senha atual
        cursor.execute("SELECT senha FROM usuario WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        if not row:
            request.session["mensagem_header"] = "Erro ao alterar senha"
            request.session["mensagem"] = "Usuário não encontrado."
            return RedirectResponse(url="/perfil", status_code=303)
        senha_atual_md5 = hashlib.md5(senha_atual.encode()).hexdigest()
        if row[0] != senha_atual_md5:
            request.session["mensagem_header"] = "Erro ao alterar senha"
            request.session["mensagem"] = "Senha atual incorreta."
            return RedirectResponse(url="/perfil", status_code=303)
        # Atualiza a senha
        nova_senha_md5 = hashlib.md5(nova_senha.encode()).hexdigest()
        cursor.execute("UPDATE usuario SET senha = %s WHERE id = %s", (nova_senha_md5, user_id))
        conn.commit()
        request.session["mensagem_header"] = "Senha alterada"
        request.session["mensagem"] = "Senha alterada com sucesso!"
        return RedirectResponse(url="/perfil", status_code=303)
    except Exception as e:
        request.session["mensagem_header"] = "Erro ao alterar senha"
        request.session["mensagem"] = str(e)
        return RedirectResponse(url="/perfil", status_code=303)
    finally:
        cursor.close()
        conn.close()