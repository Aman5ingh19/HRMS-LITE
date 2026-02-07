import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import './App.css';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="App">
                    <Sidebar />
                    <div className="main-wrapper">
                        <TopBar title="Dashboard" subtitle="Welcome back! Here's what's happening today" />
                        <div className="main-content">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/employees" element={<Employees />} />
                                <Route path="/attendance" element={<Attendance />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
