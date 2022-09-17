import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import 'react-router-dom'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

//Components
import Index from './components/public'
import Home from './components/public/Home'
import Dashboard from './components/admin/Dashboard'
import Posts from './components/admin/Publicaciones/index'
import CreatePost from './components/admin/Publicaciones/Create/CreatePost'
import Material from './components/admin/Material/index'
import Test from './components/public/Test/test'
import Role from './components/admin/Settings/Role/Role'
import User from './components/admin/Settings/Users/User'
import Auth from './components/Auth/auth'

//Providers
import DataWebProvider from './context/Context'
import PrivateRoute from './Utils/PrivateRoute'
import { Button, Result } from 'antd'
import Create from './components/admin/Settings/Role/Create/Create'


//Imports


function App() {
  return (
    <DataWebProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />}>
            <Route path='' element={<Home />} />
            <Route path='/test' element={<Test />} />
          </Route>
          <Route path='/authenticate' element={<Auth />} />
          <Route path='/dashboard' element={<Dashboard />} >
            <Route path='' element={ <Navigate to={'/dashboard/material'}/> }/>
            <Route path='post' element={<PrivateRoute redirect={'/'} element={<Posts />} ruta="post" />} />
            <Route path='post/create' element={<PrivateRoute redirect={'/'} element={<CreatePost />} ruta="post/create" />} />
            <Route path='material' element={<PrivateRoute redirect={'/'} element={<Material />} ruta='material' />} />
            <Route path='settings'>
              <Route path='role' element={<PrivateRoute redirect={'/'} element={<Role />} ruta="settings/role" />} />
              <Route path='role/create' element={<PrivateRoute redirect={'/'} element={<Create />} ruta="settings/role/create" />} />
              <Route path='user' element={<PrivateRoute redirect={'/'} element={<User />} ruta="settings/user" />} />
            </Route>
            <Route path='unallow' element={<Result
              status="403"
              title="403"
              subTitle="Sorry, you are not authorized to access this page."
              extra={<Button type="primary">Back Home</Button>}
            />} />
            <Route path='*' element={
              <Result
                status="404"
                title="404"
                subTitle="La pagina a la que quiere acceder no existe."/>
              }/>
          </Route>
        </Routes>
      </BrowserRouter>
    </DataWebProvider>
  )
}

export default App
