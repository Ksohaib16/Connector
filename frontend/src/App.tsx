import './styles/global.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { Toaster } from 'react-hot-toast';
// import Signup from './pages/v2/Signup';
// import Login from './pages/v2/Login';

function App() {
    const currUser = useSelector((state: RootState) => state.user.currUser);

    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0b1220',
                        color: '#e5e7eb',
                        border: '1px solid #1f2937',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#0b1220',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#0b1220',
                        },
                    },
                }}
            />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={currUser ? <Home /> : <Navigate to="/login" replace />}
                />
                {/* <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={currUser ? <Home /> : <Navigate to="/login" replace />}
                /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
