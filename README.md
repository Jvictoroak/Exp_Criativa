# Exp_Criativa
## FastAPI + MySql
Realizado por Elvis Claudino



### Passo a passo para rodar o projeto:
'''pip install passlib[bcrypt]'''

#### 1. Iniciar o ambiente virtual
o comando python.exe -m venv .venv depende da máquina(escreva py e de TAB, ele deverá preencher automático)
```bash
  python.exe -m venv .venv
```
```bash
  .venv/Scripts/Activate
```

#### 2. Instalar as Libs
```bash
  pip install 'fastapi[standard]' uvicorn sqlalchemy mysql-connector-python pydantic
```
- fastapi → Framework;
- sqlalchemy → ORM para interagir com o MySql;
- mysql-connector-python → Para conseguir conectar o Back ao banco;
- Pydantic → Para validar dados.
```bash
  pip install passlib
```

n sei pra que serve mas funcionou
```bash
  pip install bcrypt
```

#### 3. Rodar a API
```bash
  fastapi dev main.py
```