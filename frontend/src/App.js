import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
    return (
        <Router>
            <div>
                <h1>My App</h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<h2>Welcome! Please login or signup.</h2>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
