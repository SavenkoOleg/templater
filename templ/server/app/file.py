import os
from datetime import timedelta

from docxtpl import DocxTemplate

from app.tasks import file_delete

ALLOWED_EXTENSIONS = {'doc', 'docx'}

path = os.getenv("PATH_STORAGE")
delay = timedelta(
  minutes=int(os.getenv("DELETE_FILE_MINUTES_DELAY"))
)

text_error = "Неудалось обработать документ"
text_error_1001 = "Количество переменных в документе и в задании не совпадает"

def allowed_file(filename):
    """ Функция проверки расширения файла """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def file_scan(filename):
  result_params = []
  count = 0

  try:

    doc = DocxTemplate(path + filename)
    params = doc.get_undeclared_template_variables()
  except:
    return False, [], 0,text_error
  

  for param in params:
      result_params.append(param)
      count += 1
  
  return True, result_params, count, ""

def file_template(request_data, queue):
  context = {}

  file_name_input = request_data["file_name_input"]
  file_name_output = request_data["file_name_output"]

  for item in request_data["templ_date"]:
    context[item["key"]] = item["value"]

  try:
    doc = DocxTemplate(path + file_name_input)
    params = doc.get_undeclared_template_variables()
    if len(params) == len(context):
      doc.render(context)
      doc.save(path + file_name_output)
    else:
      return False, "", text_error_1001 
  except:
    return False, "", text_error 

  queue.enqueue_in(delay, file_delete, path + file_name_input)
  queue.enqueue_in(delay, file_delete, path + file_name_output)

  return True, file_name_output, ""