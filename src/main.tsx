import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'


// Import your Publishable Key
const PUBLISHABLE_KEY = 'pk_test_ZGVlcC10aWNrLTY0LmNsZXJrLmFjY291bnRzLmRldiQ'

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


createRoot(document.getElementById('root')!).render(


  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>



)
