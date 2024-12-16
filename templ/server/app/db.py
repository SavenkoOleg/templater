import os
import psycopg2
import json
from datetime import date
from app.tools import convetProps

#  TODO: Проверить
dbname = os.getenv("DB_NAME")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")

print(dbname)

# if dbname == None or len(dbname) == 0:
dbname = 'templater'

# if host == None or len(host) == 0:
host = 'postgresql'

# if port == None or len(port) == 0:
port = "5432"

# if user == None or len(user) == 0:
user = "apps"

# if password == None or len(password) == 0:
password = "qasw123"

conn = psycopg2.connect(dbname=dbname, host=host, user=user, password=password, port=port)
conn.autocommit = True 

# ----------------- Vars.CRUD ----------------------
def var_create(user_id, name, placeholder, data):
  var_id = None
  try:
    cursor = conn.cursor()
    cursor.execute('INSERT INTO public.vars (user_id, name, placeholder, data, create_date) VALUES (%s, %s, %s, %s, %s) RETURNING id;', (user_id, name, placeholder, str(data), date.today()))
    id = cursor.fetchone()[0]
    if id:
      var_id = id
    cursor.close()
  except:
    return None, 500, "Во время сохранения переменной произошла ошибка"

  return var_id, 200, ""

def var_delete(user_id, var_id):
    try:
      cursor = conn.cursor()
      cursor.execute('DELETE FROM ONLY public.vars WHERE id=%s AND user_id=%s', (var_id, user_id))

      cursor.close()
    except:
      return False, 500, "Во время удаления переменной произошла ошибка"

    return True, 200, ""

def var_update(user_id, var_id, name, placeholder, data):
  try:
    cursor = conn.cursor()
    cursor.execute('UPDATE public.vars SET name=%s, placeholder=%s, data=%s WHERE user_id=%s AND id=%s', (name, placeholder, str(data), user_id, var_id))
    cursor.close()
  except:
    return False, 500, 'UPDATE public.vars SET name=%s, placeholder=%s, data=%s WHERE user_id=%s AND id=%s' % (name, placeholder, str(data), user_id, var_id)

  return True, 200, ""

def var_get_all(user_id):
    vars_out = []

    try:
      cursor = conn.cursor()
      cursor.execute('SELECT id, name, placeholder, data FROM public.vars WHERE user_id=%s', (user_id,))
      vars = cursor.fetchall()

      for var in vars:
        document = {}
        document["id"] = var[0]
        document["name"] = var[1]
        document["placeholder"] = var[2]
        document["data"] = var[3]

        vars_out.append(document)
      
      cursor.close()
    except:
      return [], 500, "Во время запроса списка переменных произошла ошибка"

    if len(vars_out) == 0:
      return [], 200, "Переменные не найдены"

    return vars_out, 200, ""

# ----------------- Documents.CRUD -----------------

def add_document(user_id, filename_orig, filename):
  document_id = None
  try:
    cursor = conn.cursor()
    cursor.execute('INSERT INTO public.documents (user_id, filename_orig, filename, create_date) VALUES (%s, %s, %s, %s) RETURNING id;', (user_id, filename_orig, filename, date.today()))
    id = cursor.fetchone()[0]
    if id:
      document_id = id
    cursor.close()
  except:
    return None, 500, "Во время сохранения файла произошла ошибка"

  return document_id, 200, ""

def get_document(document_id, user_id):
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM public.documents WHERE id=%s AND user_id=%s', (document_id, user_id))
    doc = cursor.fetchone()

    cursor.close()
  except:
    return None, 500, "Не удалось выполнить запрос"
  
  if doc == None:
    return None, 404, "Документ не найден"
  
  return doc[3], 200, ""

def get_document_by_name(user_id, filename):
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM public.documents WHERE filename=%s AND user_id=%s', (filename, user_id))
    doc = cursor.fetchone()

    cursor.close()
  except:
    return None, 500, "Не удалось выполнить запрос"
  
  if doc == None:
    return None, 404, "Документ не найден"
  
  return doc[0], 200, ""

def get_documents(user_id):
  documents = []
  
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT document_id, data, filename_orig FROM public.documents JOIN public.doc_props ON documents.id = doc_props.document_id WHERE documents.user_id=%s', (user_id,))
    docs = cursor.fetchall()

    for doc in docs:
      document = {}
      document["id"] = doc[0]
      document["props"] = doc[1]
      document["filename"] = doc[2]

      documents.append(document)
      
    cursor.close()
  except:
    return [], 500, "Во время запроса списка документов произошла ошибка"
  
  if len(documents) == 0:
    return [], 200, "Документы не найдены"

  return documents, 200, ""

def delete_document(document_id, user_id):

  try:
    cursor = conn.cursor()
    cursor.execute('DELETE FROM ONLY public.doc_props WHERE document_id=%s AND user_id=%s', (document_id, user_id))

    cursor.execute('DELETE FROM ONLY public.documents WHERE id=%s AND user_id=%s', (document_id, user_id))

    cursor.close()
  except:
    return False, 500, "Во время удаления файла произошла ошибка"

  return True, 200, ""

# ----------------- Documents.Props -----------------

def add_document_props(document_id, user_id, data):
  props = convetProps(data)
  
  try:
    cursor = conn.cursor()
    cursor.execute('INSERT INTO public.doc_props (document_id, data, user_id, create_date) VALUES (%s, %s, %s, %s)', (document_id, str(props), user_id, date.today()))
    cursor.close()
  except:
    return False, 500, "Не удалось добавить набор полей"

  return True, 200, ""

def update_document_props(document_id, user_id,  data):
  try:
    cursor = conn.cursor()
    cursor.execute('UPDATE public.doc_props SET data=%s WHERE document_id=%s', (str(data), document_id,))
    cursor.close()
  except:
    return False, 500, "Не удалось сохранить параметры"

  return True, 200, ""

# ----------------- User.CRUD -----------------

def get_user_by_id(user_id):
  user = {}
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM public.user WHERE id=%s', (user_id,))
    u = cursor.fetchone()

    if u:
      user["id"] = u[0]
      user["active"] = u[4]

    cursor.close()
  except:
    return None

  return user

def get_user_by_email(email):
  user = {}
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM public.user WHERE email=%s', (email,))
    u = cursor.fetchone()

    if u:
      user["id"] = u[0]
      user["active"] = u[4]
      user["password"] = u[2]
    else:
      user = None

    cursor.close()
  except:
    return None, 500, "Не удалось выполнить запрос"

  return user, 200, ""

def new_user(email, password):
  user = {}
  try:
    cursor = conn.cursor()
    cursor.execute('INSERT INTO public.user (email, password, active, create_date) VALUES (%s, %s, true, %s)', (email, password, date.today()))
    cursor.close()
  except:
    return None, 500, "Во время создания пользователя произошла ошибка"

  return user, 200, ""

# ----------------- User.ACCESS -----------------

#  TODO: Метод подтверждения аккаунта
def confirm_user(user_id, password):
  user = {}
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM public.user WHERE id=%s', (user_id,))
    u = cursor.fetchone()

    if u:
      user["id"] = u[0]
      user["active"] = u[4]

    cursor.close()
  except:
    return None

  return user

#  TODO: Метод смены пароля
def reset_password(user_id):
  user = {}
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM public.user WHERE id=%s', (user_id,))
    u = cursor.fetchone()

    if u:
      user["id"] = u[0]
      user["active"] = u[4]

    cursor.close()
  except:
    return None

  return user

#  TODO: Проверить все новые методы
def add_access_code(user_id, code):
  try:
    cursor = conn.cursor()
    cursor.execute('INSERT INTO public.access (user_id, code, create_date) VALUES (%s, %s, %s)', (user_id, code, date.today()))
    cursor.close()
  except:
    return False, 500, "Во время создания кода проверки произошла ошибка"

  return True, 200, ""

def get_user_id_by_access_code(code):
  try:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM public.access WHERE code=%s', (code,))
    doc = cursor.fetchone()

    cursor.close()
  except:
    return None

  return doc[1]

def delete_access_code(code):
  try:
    cursor = conn.cursor()
    cursor.execute('DELETE FROM ONLY public.access WHERE code=%s', (code,))
    cursor.close()
  except:
    return False

  return True

def delete_old_access_codes(date):
  try:
    cursor = conn.cursor()
    cursor.execute('DELETE FROM public.access WHERE create_date<%s', (date,))
    cursor.close()
  except:
    return False

  return True