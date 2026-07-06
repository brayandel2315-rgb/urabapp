import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../src/modules/home/HomePage.jsx';
import ClientLayout from '../src/layouts/ClientLayout.jsx';

const qc = new QueryClient();
const container = document.createElement('div');
document.body.appendChild(container);

window.addEventListener('error', (e) => console.error('WINDOW ERROR', e.error || e.message));
window.addEventListener('unhandledrejection', (e) => console.error('REJECTION', e.reason));

try {
  createRoot(container).render(
    React.createElement(QueryClientProvider, { client: qc },
      React.createElement(BrowserRouter, null,
        React.createElement(ClientLayout, null,
          React.createElement(HomePage, null)
        )
      )
    )
  );
  setTimeout(() => {
    console.log('RENDERED OK', container.textContent?.slice(0, 120));
    process.exit(0);
  }, 2000);
} catch (e) {
  console.error('SYNC ERROR', e);
  process.exit(1);
}
