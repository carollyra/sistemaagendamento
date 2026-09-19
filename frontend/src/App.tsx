import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Book from './pages/Book';
import MyAppointments from './pages/MyAppointments';
import { SkeletonList } from './components/Skeleton';

// The admin panel is only reachable by staff, so it is loaded on demand.
const Admin = lazy(() => import('./pages/admin/Admin'));
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

        <Route element={<ProtectedRoute adminOnly />}>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<SkeletonList rows={4} label="Carregando painel" />}>
                <Admin />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
