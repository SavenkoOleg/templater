import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TemplateState } from './context/TemplateContext'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <TemplateState>
        <App />
     </TemplateState>
  </React.StrictMode>
);

reportWebVitals();
