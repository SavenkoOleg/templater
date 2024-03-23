import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TemplateState } from './context/TemplateContext'
import { ModalState } from './context/ModalContext'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ModalState>
     <TemplateState>
        <App />
     </TemplateState>
  </ModalState>
);

reportWebVitals();
