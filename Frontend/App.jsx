import React,{useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';

import Navbar from './components/Navbar';
import Allocate from './pages/Allocate';
import ViewTeams from './pages/ViewTeams';
import EvaluateTeams from './pages/EvaluateTeams';


function App() {
  const [show,setShow]=useState(false);
  return (
    <div className='w-full'>
      <Router>
        {/* Navbar is rendered conditionally */}
        <Routes>
          {/* Public routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Routes with Navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar show={show} setShow={setShow}/>
                <Routes>
                  <Route path="/" element={<Allocate show={show} setShow={setShow}/>} />
                  <Route path="/view-teams" element={<ViewTeams show={show} setShow={setShow}/>} />
                  <Route path="/evaluate-teams" element={<EvaluateTeams show={show} setShow={setShow}/>} />
                  
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
