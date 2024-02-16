import os
import random
import string

from flask import Flask, request, jsonify
from redis import Redis
from rq import Queue
from dotenv import load_dotenv

from werkzeug.utils import secure_filename

app = Flask(__name__)
path = os.getenv("PATH_STORAGE")
load_dotenv()

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


@app.route(route_prefix + "uploadfile", methods=['POST'])
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

@app.route(route_prefix + "scan", methods=['POST'])
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

@app.route(route_prefix + "templ", methods=['POST'])
def template():
  ok, filename, error  = file_template(request.get_json(), queue)

  resp = jsonify(
        success=ok,
        result = filename,
        error=error
    )

  resp.status_code = 200 if True else 500

  return resp