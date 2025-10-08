import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { persistor, store } from './store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PersistGate } from 'redux-persist/integration/react';
import AppLoader from './components/atoms/AppLoader';
import { HelmetProvider } from '@dr.pogodin/react-helmet'; 

const helmetContext = {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<AppLoader mode='page'/>}>
          <HelmetProvider context={helmetContext} >
          <RouterProvider router={router} />
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

