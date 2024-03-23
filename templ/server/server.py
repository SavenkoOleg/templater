import os
import random
import string
import jwt
from pathlib import Path
import bcrypt

from jwt import InvalidTokenError

from flask import Flask, request, jsonify
from redis import Redis
from rq import Queue
from dotenv import load_dotenv
from app.middleware import token_required
import os
from datetime import timedelta

from werkzeug.utils import secure_filename

from app.db import add_document, delete_document, add_document_props, update_document_props, confirm_user, get_user_by_email
from app.db import  get_document, add_access_code, new_user, get_documents, get_user_id_by_access_code, get_document_by_name
from app.tasks import file_delete
from app.tools import new_access_code

app = Flask(__name__)

dotenv_path = Path('.env')
load_dotenv(dotenv_path=dotenv_path)

path = os.getenv("PATH_STORAGE")

delay = timedelta(
  minutes=int(os.getenv("DELETE_FILE_MINUTES_DELAY"))
)

from app.file import file_scan, file_template, allowed_file

route_prefix = os.getenv("ROUTE_PREFIX")

queue = Queue(
    name=os.getenv("QUEUE_NAME"),
    connection=Redis(
        host=os.getenv("HOST_REDIS"),
        port=os.getenv("PORT_REDIS")
    )
)

def generate(length):
    letters = string.ascii_lowercase
    rand_string = ''.join(random.choice(letters) for i in range(length))
    return rand_string

# ============================== v 1.0 =====================================

@app.route("/tmp/uploadfile", methods=['POST'])
def file_upload():
    error = ""
    ok = False
    filename = ''

    if 'file' not in request.files:
        error = "Не могу прочитать файл"
    else:
        file = request.files['file']
        if file.filename == '':
            error = "Нет выбранного файла"
        else:
            if file and allowed_file(file.filename):
                # Удаляет название на кирилице :(, но безопасный!
                # filename = secure_filename(file.filename)
                filename = file.filename.split('.')
                filename = filename[0] + "_" + generate(4) + "." + filename[1]
                file.save(os.path.join(os.getenv("PATH_STORAGE"), filename))
                ok = True
            else:
                error = "Не допустимый формат"

    resp = jsonify(
        success=ok,
        result = filename,
        error=error
    )

    resp.status_code = 200 if ok else 500

    return resp

@app.route("/tmp/scan", methods=['POST'])
def scan():
    ok, params, count, error = file_scan(request.get_json()["file_name_input"])

    resp = jsonify(
        success=ok,
        result = params,
        count = count,
        error=error
    )

    resp.status_code = 200 if ok else 500

    return resp

@app.route("/ tmp/templ", methods=['POST'])
def template():
  ok, filename, error  = file_template(request.get_json(), queue)

  resp = jsonify(
        success=ok,
        result = filename,
        error=error
    )

  resp.status_code = 200 if True else 500

  return resp

# ============================== v 2.0 =====================================

# ------------------- Document.Templets -------------------
@app.route(route_prefix + "v2/document/templ", methods=['POST'])
@token_required
def template_v2(user_id):
    filename = ""
    ok=True
    code = 200

    body = request.get_json()

    document_id = body["document_id"]
    if not document_id:
        ok=False
        code = 400
        error = "Параметра document_id не указан"

    props = body["props"]
    if not document_id:
        ok=False
        code = 400
        error = "Параметра props не указан"

    file_name_output = body["file_name_output"]
    if not document_id:
        ok=False
        code = 400
        error = "Параметра file_name_output не указан"

    file_name_input, code, error = get_document(document_id, user_id)

    print(file_name_input)
    print(file_name_output)
            
    if filename != None:
        ok, filename, error  = file_template(user_id, file_name_input, file_name_output, props, queue)
        code = 200 if ok else 500
    else:
        ok = False

    resp = jsonify(
        success=ok,
        result = filename,
        error=error
    )

    resp.status_code = code

    return resp

# ------------------- Document.List -------------------
# +
@app.route(route_prefix + "v2/documents/get", methods=['GET'])
@token_required
def docs_get(user_id):
    ok = True
    documents, code, error = get_documents(user_id)
    
    if code != 200:
        ok = False
    # app.logger.info('%s успешно вошел в систему', user_id)
        
    resp = jsonify(
        success=ok,
        result = documents,
        error=error
    )

    resp.status_code = code

    return resp
# +
@app.route(route_prefix + "v2/document/delete", methods=['POST'])
@token_required
def doc_delete(user_id):
    ok = True
    
    document_id = request.get_json()['document_id']

    filename, code, error = get_document(document_id, user_id)
    if filename != None:
        queue.enqueue_in(delay, file_delete, os.getenv("PATH_STORAGE") + str(user_id) + os.getenv("PATH_TEMPLATES") + filename)

        ok, code, error  = delete_document(document_id, user_id)
    else:
        ok = False

    resp = jsonify(
        success=ok,
        result = [],
        error=error
    )

    resp.status_code = code

    return resp

@app.route(route_prefix + "v2/document/upload", methods=['POST'])
@token_required
def file_upload_v2(user_id):
    error = ""
    ok = False
    code = 200
    filename = ''

    if 'file' not in request.files:
        error = "Не могу прочитать файл"
    else:
        file = request.files['file']
        if file.filename == '':
            error = "Нет выбранного файла"
        else:
            if file and allowed_file(file.filename):
                filename_orig = file.filename
                # filename = secure_filename(file.filename)
                filename = filename_orig.split('.')
                filename = "file-" + generate(15) + "." + filename[1]    
                file.save(os.path.join(os.getenv("PATH_STORAGE") + str(user_id) + os.getenv("PATH_TEMPLATES"), filename))
 
                ok, params, error = file_scan(user_id, filename)
                if ok:
                    document_id, code, error = add_document(user_id, filename_orig, filename)
                    if document_id != None:
                        ok, code, error = add_document_props(document_id, user_id, params)
            else:
                error = "Недопустимый формат"

    resp = jsonify(
        success=ok,
        result = filename,
        error=error
    )

    resp.status_code = code

    return resp

# ------------------- Document.Props -------------------
@app.route(route_prefix + "v2/document/props/update", methods=['POST'])
@token_required
def doc_props_update(user_id):    
    body = request.get_json()

    document_id = body['document_id']
    data = body['props']

    ok, code, error = update_document_props(document_id, user_id, data)

    resp = jsonify(
        success=ok,
        result = None,
        error=error
    )

    resp.status_code = code

    return resp
# ------------------- Account.Reg|Login -------------------
# +
@app.route(route_prefix + "v2/user/reg", methods=['POST'])
def reg():
    body = request.get_json()
    error = ""

    email = body['email']
    password = body['password']
    confirm_password = body['confirm_password']

    ok = True
    token = ""
    code = 200

    if password != confirm_password:
        error = "Пароли не совпадают"
    elif len(email) == 0:
        error = "Email не указан"
    elif len(password) == 0 or len(confirm_password) == 0:
        error = "Пароль не указан"
    else:
        user, code, error = get_user_by_email(email)
        if user:
            error = "Такой пользователь уже существует"
        elif code == 200:
            salt = bcrypt.gensalt(2)
            h_password = bcrypt.hashpw(password, salt)

            user, code, error = new_user(email, h_password)
            if code == 200:
                user, code, error = get_user_by_email(email)
                if user:
                    user_id = user["id"]
                    res, code, error = add_access_code(user_id, new_access_code())
                    if res:
                        token = jwt.encode(payload={'user_id': user_id}, key=os.getenv("JWT_SECRET"), algorithm='HS256')
                        os.makedirs(os.getenv("PATH_STORAGE") + str(user_id) + os.getenv("PATH_TEMPLATES"), exist_ok=True)
                        os.makedirs(os.getenv("PATH_STORAGE") + str(user_id) + os.getenv("PATH_GENERATED"), exist_ok=True)

    if len(token) == 0:
        ok=False

     #  TODO: Отправка письма подтверждения

    resp = jsonify(
        success=ok,
        result = token,
        error=error
    )

    resp.status_code = code

    return resp
# +
@app.route(route_prefix + "v2/user/login", methods=['POST'])
def login():
    body = request.get_json()
    error = ""
    code = 200
    ok = True
    token =  ''
    email = body['email']
    password = body['password']

    if not email and not password:
        error = 'Не указан email или пароль'
    else:
        user, code, error = get_user_by_email(email)   
        if user:
            h_password = bcrypt.hashpw(password, user["password"])
            if h_password != user["password"]:
                error = 'Неверный пароль'
            else:
                token = jwt.encode(payload={'user_id': user["id"]}, key=os.getenv("JWT_SECRET"), algorithm='HS256')
        else:
            error = 'Такого пользователя не существует'

    if len(token) == 0:
        ok=False

    resp = jsonify(
        success=ok,
        result = token,
        error=error
    )

    resp.status_code = code

    return resp

# ------------------- Account.Recovery -------------------

@app.route(route_prefix + "v2/user/recovery", methods=['POST'])
def recovery_account():
    body = request.get_json()
    email = body['email']

    ok = False
    error = ""
    code = 400
    print(email, " \n ====================== \n")
    if len(email) == 0:
        error = 'Не указан email'
    else:
        user, code, error = get_user_by_email(email)
        if user != None:
            print(user, " \n ====================== \n")
            code = new_access_code()
            add_access_code(user["id"], code)
            ok = True
            code = 200

    #  TODO: Отправить код по почте
        
    resp = jsonify(
        success=ok,
        result = [],
        error=error
    )

    resp.status_code = code

    return resp

@app.route(route_prefix + "v2/user/confirm", methods=['POST'])
def confirm_account():
    ok=True
    error = ''
    code = ''

    body = request.get_json()

    email = body["email"]

    user = get_user_by_email(email)

    if user:
        user_id = user["id"]

        code = new_access_code()

        user_confirm = add_access_code(user_id, code)

        if user_confirm:
            error = 'Пользователь не найден'
            ok=False
        else:
            confirm_user(user_confirm[0])
    
    resp = jsonify(
        success=ok,
        result = code,
        error=error
    )

    resp.status_code = 200 if True else 500

    return resp

@app.route(route_prefix + "v2/user/reset", methods=['POST'])
def reset_password():
#  TODO: Метод восстановления пароля
    error = ''
    ok=True

    body = request.get_json()

    code = body["code"]
    password = body["password"]
    confirm_password = body["confirm_password"]

    if password != confirm_password:
        error = "Пароли не совпадают"
        ok=False
    else:
        user = get_user_id_by_access_code(code)

        if user:
            error = 'Пользователь не найден'
            ok=False
        else:
            confirm_user(user[0], password)
    
    resp = jsonify(
        success=ok,
        result = [],
        error=error
    )

    resp.status_code = 200 if True else 500

    return resp