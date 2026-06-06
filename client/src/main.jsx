import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { CategoryProvider } from '@/context/CategoryContext'
import { SocketProvider } from '@/context/SocketContext'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import App from '@/App'

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; // Mock ID for simulation

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <CategoryProvider>
              <SocketProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </SocketProvider>
            </CategoryProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
