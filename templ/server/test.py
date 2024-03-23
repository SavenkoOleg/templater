params = ["test 1", "test 2", "test 3"]


result = list()
n = 0
for p in params:
  n = n + 1
  item = {"itemId": str(n), "content": {"name": p, "value": ""}}
  columns = list()
  columns.append(item)
  column = {"columnId": str(n), "column": columns}
  result.append(column)

print(result)