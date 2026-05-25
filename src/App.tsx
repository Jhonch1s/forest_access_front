import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PunteroLayout from './components/PunteroLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Cuadrillas from './pages/Cuadrillas';
import Parcelas from './pages/Parcelas';
import Tareas from './pages/Tareas';
import Reportes from './pages/Reportes';
import Liquidaciones from './pages/Liquidaciones';
import Configuracion from './pages/Configuracion';
import Categorias from './pages/Categorias';
import AsignarTratamientos from './pages/AsignarTratamientos';
import PunteroPanel from './pages/PunteroPanel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas ADMIN */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/asignar-tratamientos"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <AsignarTratamientos />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/empleados"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Empleados />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cuadrillas"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Cuadrillas />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/parcelas"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Parcelas />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tareas"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Tareas />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Reportes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/liquidaciones"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Liquidaciones />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Configuracion />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute requiredProfile="admin">
                <Layout>
                  <Categorias />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Ruta PUNTERO */}
          <Route
            path="/puntero"
            element={
              <ProtectedRoute requiredProfile="puntero">
                <PunteroLayout>
                  <PunteroPanel />
                </PunteroLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
