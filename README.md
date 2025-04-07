# Exp_Criativa
## FastAPI + MySql
Realizado por Elvis Claudino

### Passo a passo para rodar o projeto:

#### 1. Iniciar o ambiente virtual
```bash
  python -m venv venv
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

#### 3. Rodar a API
```bash
  fastapi dev main.py
```