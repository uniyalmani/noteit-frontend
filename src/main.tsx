import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import NoteList from './components/notes/NoteList.tsx'
import SignIn from './components/auth/SignIn.tsx'
import SignUp from './components/auth/SignUp.tsx'
import About from './components/common/About.tsx'
import CreateNotePage from './components/notes/CreateNotePage.tsx'
import { AuthProvider } from './AuthContext';

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<App />}>
        <Route path='' element={<NoteList />}/>
        <Route path='signin' element={<SignIn />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='about' element={<About />} />
        <Route path='createnote' element={<CreateNotePage />} />
      </Route>
    )
  )

  ReactDOM.createRoot(document.getElementById('root')!).render(

    <AuthProvider> {/* Wrap your app with AuthProvider */}
        <RouterProvider router={router} />
    </AuthProvider>
  
  )