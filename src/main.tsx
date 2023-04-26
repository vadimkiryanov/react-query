import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Импорт RQ
import { QueryClient, QueryClientProvider } from 'react-query';

// Создание нового клиента RQ
const queryClient = new QueryClient();

// Оборачиваем в провайдер RQ
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
