import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { persistor, store } from './store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PersistGate } from 'redux-persist/integration/react';
import AppLoader from './components/atoms/AppLoader';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<AppLoader mode='page'/>}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

