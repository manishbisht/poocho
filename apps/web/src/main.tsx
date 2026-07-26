import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PoochoApp from './poocho/PoochoApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PoochoApp />
  </StrictMode>,
)
