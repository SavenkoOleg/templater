import os
from datetime import timedelta

from docxtpl import DocxTemplate

from app.tasks import file_delete

ALLOWED_EXTENSIONS = {'doc', 'docx'}

path = os.getenv("PATH_STORAGE")
delay = timedelta(
  minutes=int(os.getenv("DELETE_FILE_MINUTES_DELAY"))
)

text_error_1000 = "Неудалось обработать документ. В шаблоне содержатся ошибки!"
text_error_1001 = "Неудалось обработать документ. В документе нет шаблонных переменных!"
text_error_1002 = "Количество переменных в документе и в задании не совпадает"

def allowed_file(filename):
    """ Функция проверки расширения файла """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def file_scan(user_id, filename):
  result_params = []
 
  try:

    doc = DocxTemplate(os.getenv("PATH_STORAGE") + str(user_id) + os.getenv("PATH_TEMPLATES") + filename)
    params = doc.get_undeclared_template_variables()
  except:
    return False, [], text_error_1000
  
  if len(params) == 0:
     return False, [], text_error_1001

  for param in params:
      result_params.append(param)
  
  return True, result_params, ""

def file_template(user_id, file_name_input, file_name_output, props, queue):
  context = {}

  for prop in props:
    context[prop["key"]] = prop["value"]

  path_input = os.getenv("PATH_STORAGE") + str(user_id) + os.getenv("PATH_TEMPLATES") + file_name_input
  path_output = os.getenv("PATH_STORAGE") + str(user_id) + os.getenv("PATH_GENERATED") + file_name_output

  try:
    doc = DocxTemplate(path_input)
    params = doc.get_undeclared_template_variables()
    if len(params) == len(context):
      doc.render(context)
      doc.save(path_output)
    else:
      return False, "", text_error_1002 
  except:
    return False, "", text_error_1000 

  # queue.enqueue_in(delay, file_delete, path + file_name_output)

  return True, str(user_id) + os.getenv("PATH_GENERATED") + file_name_output, ""