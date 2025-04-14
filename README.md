
comando: 
pip install passlib[bcrypt]
 python.exe -m venv .venv 
 .venv/Scripts/Activate  
 pip install --upgrade -r requirements.txt
pip install uvicorn
python -m uvicorn main:app --reload
