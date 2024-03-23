
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
