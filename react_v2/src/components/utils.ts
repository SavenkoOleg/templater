
export const clone = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const onChange = (source:any, destination:any) => {
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return true;
  }
  return false;
};

// export const deleteTask = (data:any, { droppableId, index }) => {
//   data = clone(data);
//   data.columns[droppableId].taskIds.splice(index, 1);
//   return data;
// };

// export const addTask = (data, { droppableId, index }, taskId:any) => {
//   data = clone(data);
//   data.columns[droppableId].taskIds.splice(index, 0, taskId);
//   return data;
// };

export type ContentI = {
  name: string
  value: string
}

export type ItemI = {
  itemId: string
  content: ContentI
}


export type ColumnI = {
  columnId: string
  column: ItemI[]
}

export const normalize = (columns: ColumnI[]) => {
  columns = columns.filter(column => column.column.length === 0 ? false : true)

  var columns_: ColumnI[] = []

  columns.map(column => {
    columns_.push(column)
    columns_.push({
      columnId: String(Math.floor(Math.random() * 1000)),
      column: []
    })
  })

  columns_.unshift({
    columnId: String(Math.floor(Math.random() * 1000)),
    column: []
  })

  return columns_
} 
