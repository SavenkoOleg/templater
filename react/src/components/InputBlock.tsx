import "bootstrap/dist/css/bootstrap.min.css";
import {useState} from 'react'

type TemplBlockInterface = {
  item: string
  index: number
  addParam: (name: string, value: string, key: number) => void
}

const InputBlock = ({item, index, addParam}:TemplBlockInterface) => {
  const [value, setValue] = useState<string>();

  const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setValue(value);
    
    addParam(name, value, index);
  }
  

  return (
    <div className="form-group row" key={index}>
      <label className="col-sm-3 col-form-label">{item}</label>
        <div className="col-sm-9">
          <input 
            type="text"
            name={item}
            className="form-control"
            value={value}
            onChange={changeHandler}
          />
        </div>
      </div>
  );
};

export default InputBlock;