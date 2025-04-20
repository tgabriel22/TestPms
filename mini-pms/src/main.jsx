// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import AppRouter from './routes/Router';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { TaskModalProvider } from './context/TaskModalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <AppRouter />
  // </React.StrictMode>

  <BrowserRouter>
  <TaskModalProvider>
    <App />
  </TaskModalProvider>
  </BrowserRouter>
);

