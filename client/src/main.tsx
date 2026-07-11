import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {HeroUIProvider} from "@heroui/react";
import { BrowserRouter } from 'react-router-dom';
import store from './store/index.ts';
import { Provider } from 'react-redux';
import AuthProvider from './context/AuthProvider.tsx';
import CartProvider from './context/CartProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
     
    <BrowserRouter>
       <HeroUIProvider>
<main className="text-foreground bg-background min-h-screen">
            <AuthProvider>
              <CartProvider>
              <App />
              </CartProvider>
            </AuthProvider>
          </main>
        </HeroUIProvider>
    </BrowserRouter>
  
    </Provider>
  </StrictMode>
)
