import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/LoginForm'; // Пример страницы логина
import RegisterPage from './components/RegisterForm';
import ProfilePage from "./components/ProfilePage";
import UpdateUserPage from "./components/UpdateUserPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/update-user" element={<UpdateUserPage />} />

            </Routes>
        </Router>
    );
};

export default App;
