import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PoochoApp from './poocho/PoochoApp'
import { initClarity } from './lib/clarity'

initClarity(import.meta.env.VITE_CLARITY_PROJECT_ID)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PoochoApp />
  </StrictMode>,
)
