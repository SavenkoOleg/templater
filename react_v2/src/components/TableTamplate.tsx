import "bootstrap/dist/css/bootstrap.min.css";
import InputBlock from "./InputBlock";
import {useState, useContext} from 'react'
import TemplaterService, { ITemplater } from "../services/TemplaterService";
import {IDataVar, IVarP, TemplateContext} from "../context/TemplateContext";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FileUploadService from "../services/TemplaterService";
import { useCookies } from 'react-cookie';
import {ColumnI, normalize} from "./utils"
import ButtonSizesExample from "./OptionBlock";

const TableTemplate = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  const {inputFilename, setOutputFilename, setStep, StepBack, file} = useContext(TemplateContext)

  const [editProps, setEditProps] = useState<boolean>(false);
  const [activeTempl, setActiveTempl] = useState<boolean>(false);

  const [columns, setColumns] = useState<ColumnI[]>(file.props);
  
  const onDragEnd = (result: any, columns: ColumnI[], setColumns: any) => {
    if (!editProps) {setEditProps(true)}
  
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
    columns.map((column:ColumnI) => {
      column.column.map(item => {
        item.content.value = ""
      })
    })

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

  const {vars} = useContext(TemplateContext)

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
                                  <Draggable key={item.itemId} draggableId={item.itemId} index={index}>
                                    {(provided, snapshot) => {
                                        let flag: boolean = false
                                        let data: IDataVar[] = []

                                        vars.map((v:IVarP) => {
                                            if (v.placeholder === item.content.name) {
                                                flag = true
                                                data = v.data
                                            }
                                        });

                                      return (
                                        <div className="DndItem" key={item.itemId}>
                                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style}}>
                                              {flag ?
                                                  <ButtonSizesExample value={item.content.value} name={item.content.name} index={item.itemId} data={data} addParam={AddParams}/> :
                                                  <InputBlock value={item.content.value} name={item.content.name} index={item.itemId} addParam={AddParams}/>
                                              }
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

      <button className="btn btn-success mrr-10" onClick={StepBack}>Назад к документам</button>
      <button className="btn btn-success" disabled={!activeTempl} onClick={send}>Заполнить шаблон</button>
    </>
  );
};

export default TableTemplate;