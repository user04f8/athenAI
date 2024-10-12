import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import TestEssayEditor from './components/TestEssayEditor.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <TestEssayEditor />
  </StrictMode>,
)
