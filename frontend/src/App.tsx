import './styles/global.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

function App() {
    const currUser = useSelector((state: RootState) => state.user.currUser);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={currUser ? <Home /> : <Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
