import "bootstrap/dist/css/bootstrap.min.css";
import {useState} from 'react'

type TemplBlockInterface = {
  name: string
  value: string
  index: string
  addParam: (name: string, value: string, key: string) => void
}

const InputBlock = ({name, value, index, addParam}:TemplBlockInterface) => {
  const [valueST, setValueST] = useState<string>(value);

  const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    setValueST(value)

    addParam(name, value, index);
  }

  return (
      <div className="DnDInput" key={index}>
        <input
            type="text"
            name={name}
            placeholder={name}
            className="form-control"
            style={valueST.length > 0 ? {borderColor: "rgba(90, 209, 96)"} : {}}
            value={valueST}
            onChange={changeHandler}
        />
      </div>
  );
};

export default InputBlock;