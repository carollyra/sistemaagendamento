import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Book from './pages/Book';
import MyAppointments from './pages/MyAppointments';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/book" element={<Book />} />
          <Route path="/appointments" element={<MyAppointments />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
