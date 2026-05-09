import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/empleados"
          element={
            <Layout>
              <Empleados />
            </Layout>
          }
        />
        <Route
          path="/cuadrillas"
          element={
            <Layout>
              <Cuadrillas />
            </Layout>
          }
        />
        <Route
          path="/parcelas"
          element={
            <Layout>
              <Parcelas />
            </Layout>
          }
        />
        <Route
          path="/tareas"
          element={
            <Layout>
              <Tareas />
            </Layout>
          }
        />
        <Route
          path="/reportes"
          element={
            <Layout>
              <Reportes />
            </Layout>
          }
        />
        <Route
          path="/liquidaciones"
          element={
            <Layout>
              <Liquidaciones />
            </Layout>
          }
        />
        <Route
          path="/configuracion"
          element={
            <Layout>
              <Configuracion />
            </Layout>
          }
        />
        <Route
          path="/categorias"
          element={
            <Layout>
              <Categorias />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
