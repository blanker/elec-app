import React from 'react';
import ReactDOM from 'react-dom/client';
import RootRouter from './app/routes';
import './index.css';
import { SearchParamsProvider } from "@/hooks/sourceContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div className='rounded-full min-w-[320px] min-h-[480px] flex flex-col justify-center'>
    <SearchParamsProvider>
      <RootRouter />
    </SearchParamsProvider>
  </div>
);
