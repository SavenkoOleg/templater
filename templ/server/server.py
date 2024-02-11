import re
from docx import Document
from docxtpl import DocxTemplate
from flask import Flask, request, jsonify

app = Flask(__name__)

path = "./data_storage/"
pattern = r"\{\{\w{1,}\}\}"
regex = re.compile(pattern)

@app.route("/tmp/scan", methods=['POST'])
def scan():
    params = []

    try:
        doc = Document(path + request.get_json()["file_name_input"])

        for paragraph in doc.paragraphs:
            if regex.search(paragraph.text):
                for m in re.finditer(pattern, paragraph.text):
                    params.append(m.group(0)[2:len(m.group(0))-2])
    except:
        resp = jsonify(success=False, error="Неудалось обработать документ")
        resp.status_code = 500

    resp = jsonify(success=True, params=list(set(params)))
    resp.status_code = 200

    return resp

@app.route("/tmp/templ", methods=['POST'])
def templ():
    request_data = request.get_json()

    file_name_input = request_data["file_name_input"]
    file_name_output = request_data["file_name_output"]

    context = {}

    for item in request_data["templ_date"]:
        context[item["key"]] = item["value"]

    try:
        doc = DocxTemplate(path + file_name_input)
        doc.render(context)
        doc.save(path + file_name_output)
    except:
        resp = jsonify(success=False, error="Неудалось обработать документ")
        resp.status_code = 500

    resp = jsonify(success=True, filename=file_name_output)
    resp.status_code = 200

    return resp