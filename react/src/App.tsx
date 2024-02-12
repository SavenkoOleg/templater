import './App.css';
import General from './components/General';
import { useContext } from "react";
import {TemplateContext} from "./context/TemplateContext"

function App() {
  const {step} = useContext(TemplateContext)

  return (
    <div className="App">
      <header className="App-header">
        <p>Шаблонизатор</p>
      </header>
      
      <div className="App-Card">
          <General step={step}/>
      </div>
    </div>
  );
}

export default App;
