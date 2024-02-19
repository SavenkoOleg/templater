import "bootstrap/dist/css/bootstrap.min.css";
import InputBlock from "./InputBlock";
import {useState, useEffect, useContext} from 'react'
import TemplaterService, { ITemplater } from "../services/TemplaterService";
import { TemplateContext } from "../context/TemplateContext";

type ParamInterface = {
  key: number
  name: string
  value: string
}

const TableTemplate = () => {

  const {inputFilename, paramsScan, setOutputFilename, setStep, StepBack} = useContext(TemplateContext)

  const [paramsData, setParamsData] = useState<ParamInterface[]>([]);

  const AddParams = (name: string, value: string, key: number) => {
        var params: ParamInterface[] = paramsData;

        params = params.filter(item => item.key === key ? false : true)

        setParamsData([...params, {name, value, key}])
  }

  const send = () => {
    var data:ITemplater;

    var splitted = inputFilename.split(".", 3); 
    var outputFileName = splitted[0] + '-generated.' + splitted[1]

    data = {
      file_name_input: inputFilename,
      file_name_output: outputFileName,
      templ_date: []
    }
    
    paramsData.map(item => {
      data.templ_date.push({key: item.name, value: item.value})
    })

    TemplaterService.templ(data)
      .then(() => {
        setOutputFilename(outputFileName)
        setStep()
      })
      .catch(() => {
      });
  }

  return (
    <>
      <form>
        {paramsScan.map((item, index) => <InputBlock item={item} index={index} addParam={AddParams}/>)}
      </form>
      <button
        className="btn btn-success btn-lg mrr-10"
        onClick={StepBack}
        >
        Назад
      </button>
      <button
        className="btn btn-success btn-lg"
        disabled={paramsData.length === 0 || paramsData.length !== paramsScan.length}
        onClick={send}
        >
        Дальше
      </button>
    </>
  );
};

export default TableTemplate;