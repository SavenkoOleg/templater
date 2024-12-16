import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import {useState} from "react";
import {IDataVar} from "../context/TemplateContext";
import * as React from "react";

type TemplBlockInterface = {
    name: string
    value: string
    index: string
    data: IDataVar[]
    addParam: (name: string, value: string, key: string) => void
}

const ButtonSizesExample = ({name, value, index, data, addParam}:TemplBlockInterface) => {
        const [valueST, setValueST] = useState<string>(value);

        const handleChange = (_name:string, event:any) => {
            let value = event.target.value;

            setValueST(value);
            addParam(name, value, index);
        }

        const handlerSelect = (e:string|null) => {
            if (e !== null) {
                data.map((item:IDataVar)=>{
                    if (item.id === parseInt(e)) {
                        setValueST(item.text);
                        addParam(name, item.text, index);
                    }
                })
            }
        }

    return (
        <div className="DnDInput" key={index}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={valueST}
                    type="text"
                    placeholder={name}
                    style={valueST.length > 0 ? {borderColor: "rgba(90, 209, 96)"} : {}}
                    onChange={handleChange.bind(this, name)}/>

                <DropdownButton
                    variant="outline-secondary"
                    title="Выбрать"
                    id={index}
                    align="end"
                    onSelect={handlerSelect}>
                    {data.map((item:IDataVar) => (<Dropdown.Item eventKey={item.id}>{item.text}</Dropdown.Item>))}
                </DropdownButton>
            </InputGroup>
        </div>
    )
}
{/*Dropdown.Item key={item.id}>{item.text}</Dropdown.Item>*/}
export default ButtonSizesExample;

// https://stackoverflow.com/questions/32510976/react-bootstrap-dropdown-with-input-wont-stay-open
// https://react-bootstrap.netlify.app/docs/components/dropdowns/
// https://react-bootstrap.netlify.app/docs/forms/input-group/
// https://github.com/react-bootstrap/react-bootstrap/issues/2756