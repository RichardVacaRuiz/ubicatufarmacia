/*
import NavBar from './components/NavBar';
import Notification from './components/Notification'; 
import React from 'react';
import Login from './components/user/Login';
//import Loading from './components/Loading';
import BottomNav from './components/BottomNav';
import Room from './components/rooms/Room';



const App = () => {
  return (
    <>
    <Notification/>
    <Login/>
    <NavBar/>
    <BottomNav/>
    <Room/>
    </>
  );
};

export default App;*/

 
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/Home';
import Loading from './components/Loading';
import Notification from './components/Notification';
import Room from './components/rooms/Room';

const App = () => {
  return (
    <>
      <Loading />
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route path="dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<Home/>} />
        </Routes>
      </BrowserRouter>
      <Room />
    </>
  );
};

export default App;
