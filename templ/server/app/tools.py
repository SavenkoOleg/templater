import random, string, os

def new_access_code():
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(int(os.getenv("ACCESS_LENGTH"))))

def convetProps(params):
   result = list()
   n = 0
   
   for p in params:
      n = n + 1
      item = {"itemId": str(n), "content": {"name": p, "value": ""}}
      columns = list()
      columns.append(item)
      column = {"columnId": str(n), "column": columns}
      result.append(column)

   return result