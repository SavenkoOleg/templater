import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Registration from './components/Auth/Registration';
import Recovery from './components/Auth/Recovery';
import Login from './components/Auth/Login';
import General from './components/General';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<General/>} />
          <Route path="login" element={<Login/>} />
          <Route path="registration" element={<Registration/>} />
          <Route path="recovery" element={<Recovery/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
