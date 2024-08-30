import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Workouts from './pages/Workouts';

import { UserProvider } from './UserContext';

function App() {

    const [ user, setUser] = useState({
        id: null,
        isAdmin: null
    })

    useEffect(() => {

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
            Authorization: `Bearer ${ localStorage.getItem('token') }`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)

        if (typeof data.user !== "undefined") {
      
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            });
      
        } else {
      
            setUser({
                id: null,
                isAdmin: null
            });
      
        }
  
    })
  
    }, []);

    const unsetUser = () => {

        localStorage.clear();

    };

    return (
        <UserProvider value={{user, setUser, unsetUser}}>
            <Router>
                <AppNavbar />
                <Container>
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/register" element={<Register />}/>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/logout" element={<Logout />}/>
                        <Route path="/workouts" element={<Workouts />}/>
                    </Routes>
                </Container>
            </Router>
        </UserProvider>
    );
}

export default App;
