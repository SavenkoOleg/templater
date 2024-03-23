import "bootstrap/dist/css/bootstrap.min.css";
import InputBlock from "./InputBlock";
import {useState, useContext} from 'react'
import TemplaterService, { ITemplater } from "../services/TemplaterService";
import { TemplateContext } from "../context/TemplateContext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FileUploadService from "../services/TemplaterService";
import { useCookies } from 'react-cookie';

type ParamInterface = {
  key: number
  name: string
  value: string
}

type ContentI = {
  name: string
  value: string
}

type ItemI = {
  itemId: string
  content: ContentI
}

export type ColumnI = {
  columnId: string
  column: ItemI[]
}

const TableTemplate = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const {inputFilename, setOutputFilename, setStep, StepBack, file} = useContext(TemplateContext)

  const [editProps, setEditProps] = useState<boolean>(false);
  const [activeTempl, setActiveTempl] = useState<boolean>(false);

  const normalize = (columns: ColumnI[]) => {
    console.log(columns)
    columns = columns.filter(column => column.column.length === 0 ? false : true)
    columns.unshift({
      columnId: String(Math.floor(Math.random() * 1000)),
      column: []
    })

    columns.push({
      columnId: String(Math.floor(Math.random() * 1000)),
      column: []
    })
    console.log(columns)
    return columns
  } 

  const propsScan: ColumnI[] = [
    {
      columnId: "1",
      column: []
    },
    {
      columnId: "2",
      column: [{
        itemId: "1",
        content: {
          name: "test 1",
          value: ""
        }
      }]
    },
    {
      columnId: "3",
      column: [
        {
          itemId: "2",
          content: {
            name: "test 2",
            value: ""
          }
        },{
          itemId: "3",
          content: {
            name: "test 3",
            value: ""
          }
        }
      ]
    },
    {
      columnId: "4",
      column: [
        {
          itemId: "4",
          content: {
            name: "test 4",
            value: ""
          }
        },{
          itemId: "5",
          content: {
            name: "test 5",
            value: ""
          }
        },{
          itemId: "6",
          content: {
            name: "test 6",
            value: ""
          }
        }
      ]
    },
    {
      columnId: "5",
      column: [
        {
          itemId: "7",
          content: {
            name: "test 7",
            value: ""
          }
        },{
          itemId: "8",
          content: {
            name: "test 8",
            value: ""
          }
        },{
          itemId: "9",
          content:{
            name: "test 9",
            value: ""
          }
        },{
          itemId: "10",
          content: {
            name: "test 10",
            value: ""
          }
        }
      ]
    },
    {
      columnId: "6",
      column: []
    }
  ]
  
  const [columns, setColumns] = useState<ColumnI[]>(file.props);
  
  const onDragEnd = (result: any, columns: ColumnI[], setColumns: any) => {
    if (!editProps) {setEditProps(true)}
  
    console.log(result)
    if (!result.destination) return;
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
  
      const sourceColumn = columns.find(column => column.columnId === source.droppableId)
      const destColumn = columns.find(column => column.columnId === destination.droppableId)

      if (sourceColumn && destColumn) {
        const sourceItems = [...sourceColumn?.column];
        const destItems = [...destColumn.column];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);

        var columns_ = columns

        columns_.map( column => {
          if (column.columnId === source.droppableId) {
            column.column = sourceItems
          }
          if (column.columnId === destination.droppableId) {
            column.column = destItems
          }
        });


        columns_ = normalize(columns_);
        setColumns(columns_);
      }

    
    } else {
        var columns_ = columns

        columns_.map( column => {
          if (column.columnId === source.droppableId) {
            const copiedItems = [...column.column];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            column.column = copiedItems
        }});

        columns_ = normalize(columns_);
        setColumns(columns_);
    }
  };

  const AddParams = (name: string, value: string, key: string) => {
        var columns_ = columns
        var itemsInit = 0
        var itemsFinish = 0

        columns.map((column: ColumnI) => {
          column.column.map(item => {
            itemsInit++
            if (item.itemId === key) {
              item.content.value = value
            }
            if (item.content.value.length > 0) itemsFinish++
          })
        })

        setActiveTempl(itemsInit === itemsFinish)

        setColumns(columns_)
  }

  function saveProps(columns: ColumnI[]){
    FileUploadService.saveProps(cookies["token"], file.id, columns)
    .then((response) => {
    })
    .catch((err) => {
    });
  }

  const send = () => {
    var data:ITemplater;

    var splitted = inputFilename.split(".", 3); 
    var outputFileName = splitted[0] + '-generated.' + splitted[1]

    data = {
      file_name_input: inputFilename,
      file_name_output: outputFileName,
      document_id: file.id,
      props: []
    }
    
    columns.map(column => {
      column.column.map(item => {
        data.props.push({key: item.content.name, value: item.content.value})
      })
    })

    TemplaterService.templ(cookies["token"], data)
      .then((response) => {
        setOutputFilename(response.data.result)
        setStep()
      })
      .catch(() => {
      });
  }

  return (
    <>
        <div className="row" style={{padding: "0px", margin: "0px"}}>

          <div className="col-9" style={{textAlign: "left", padding: "0px", margin: "0px"}}>
            <h5>Укажите значения для замены</h5>
          </div>

          {editProps &&
            <div className="col-3" style={{ textAlign: "right", padding: "0px", margin: "0px" }}>
              <button className="btn btn-info btn-sm" onClick={() => {
                saveProps(columns)
                setEditProps(false)
              }}>
                Сохранить
              </button>
            </div>}
        </div>

        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>

          {columns.map((column, index) => {

            var DnDContainer = "DnDContainer"
            if (column.column) {
              DnDContainer = column.column.length === 0 ? DnDContainer + " DnDEmpty" : DnDContainer
            }
              
                return (
                  <Droppable droppableId={column.columnId} key={column.columnId} direction="horizontal">
                    {(provided, snapshot) => {
                      return (
                        // style={{background: snapshot.isDraggingOver ? "lightblue" : "lightgrey"}
                        <div {...provided.droppableProps} ref={provided.innerRef}> 
                          <div className={DnDContainer} key={column.columnId}>

                              {column.column.map((item, index) => {
                                return (
                                  <Draggable key={item.itemId} draggableId={item.itemId} index={index} >
                                    {(provided, snapshot) => {

                                      return (
                                        <div className="DndItem" key={item.itemId}>
                                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style}}>
                                            <InputBlock value={item.content.value} name={item.content.name} index={item.itemId} addParam={AddParams}/>
                                          </div>
                                        </div>
                                      )
                                      
                                    }}
                                  </Draggable>
                                );

                              })}

                            </div>
                          {provided.placeholder}
                        </div>
                      );
                    }}

                  </Droppable>
                )

          })}

        </DragDropContext>

      <button
        className="btn btn-success mrr-10"
        onClick={StepBack}>
          Назад к документам
      </button>

      <button
        className="btn btn-success"
        disabled={!activeTempl}
        onClick={send}>
          Заполнить шаблон
      </button>
    </>
  );
};

export default TableTemplate;