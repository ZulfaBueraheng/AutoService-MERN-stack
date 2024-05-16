import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './components/register/Signup'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Topbar from './components/topbar/Topbar'
import Startpage from './components/startpage/Startpage'
import Login from './components/login/Login'
import Home from './components/home/Home'
import History from './components/history/History'
import Report from './components/report/Report'
import EmployeeManagement from './components/informationmanagement/employeemanagement/EmployeeManagement'
import TabView from './components/informationmanagement/tabview/TabView'
import SpareManagement from './components/informationmanagement/sparemanagement/SpareManagement'
import CarRegistration from './components/home/carregistation/CarRegistration'
import Receipt from './components/receipt/Receipt'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Topbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Startpage />}></Route>
        <Route path='/register' element={isLoggedIn ? <Signup /> : <Navigate to='/login' />}></Route>
        <Route path='/login' element={<Login onLogin={() => setIsLoggedIn(true)} />}></Route>
        <Route path='/home' element={isLoggedIn ? <Home /> : <Navigate to='/login' />}></Route>
        <Route path='/history' element={isLoggedIn ? <History /> : <Navigate to='/login' />}></Route>
        <Route path='/report' element={isLoggedIn ? <Report /> : <Navigate to='/login' />}></Route>
        <Route path='/infomanage' element={isLoggedIn ? <TabView /> : <Navigate to='/login' />}></Route>
        <Route path='/employee' element={isLoggedIn ? <EmployeeManagement /> : <Navigate to='/login' />}></Route>
        <Route path='/spare' element={isLoggedIn ? <SpareManagement /> : <Navigate to='/login' />}></Route>
        <Route path='/carregis' element={isLoggedIn ? <CarRegistration /> : <Navigate to='/login' />}></Route>
        <Route path='/receipt/:customerId' element={isLoggedIn ? <Receipt /> : <Navigate to='/login' />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App