import { useState } from 'react';
import ConfigCard from '../components/ConfigCard';
import CatalogModal from '../components/CatalogModal';
import { useCategorias } from '../hooks/useCategorias';
import { useProductos } from '../hooks/useProductos';
import { useHabilitaciones } from '../hooks/useHabilitaciones';
import {
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../services/categoriaService';
import {
  createProducto,
  updateProducto,
  deleteProducto,
} from '../services/productoService';
import{
  createHabilitacion,
  updateHabilitacion,
  deleteHabilitacion,
} from '../services/habilitacionService';

import type { FieldConfig } from '../components/FormModal';
import './Configuracion.css';

const categoriaColumns = [
  { key: 'idCategoria', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'valorJornal', label: 'Valor Jornal' },
  { key: 'descripcion', label: 'Descripción' },
];

const categoriaFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'valorJornal', label: 'Valor Jornal', type: 'number', required: true, step: '0.01' },
  { name: 'descripcion', label: 'Descripción' },
];

const productoColumns = [
  { key: 'idProducto', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'contenido', label: 'Contenido' },
  { key: 'concentracion', label: 'Concentración' },
  { key: 'unidadBase', label: 'Unidad Base' },
];

const productoFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'contenido', label: 'Contenido', required: true },
  { name: 'concentracion', label: 'Concentración' },
  { name: 'unidadBase', label: 'Unidad Base' },
];

const habilitacionColumns = [ 
  { key: 'idHabilitacion', label:'ID'},
  { key: 'nombre', label:'Nombre'},
  { key: 'descripcion', label:'Descripcion'},
]

const habilitacionFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', required: true},
  { name: 'descripcion', label: 'Descripcion', required: true }
]


function Configuracion() {
  const { categorias, loading: loadingCategorias, refetch: refetchCategorias } = useCategorias();
  const { productos, loading: loadingProductos, refetch: refetchProductos } = useProductos();
  const { habilitaciones, loading: loadingHabilitaciones, refetch:refetchHabilitaciones} = useHabilitaciones();
  console.log(habilitaciones);
  console.log(productos);
  console.log(categorias);
  const [modalHabilitacion, setModalHabilitacion] = useState(false);
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);

  return (
    <div className="config-page">
      <div className="page-header">
        <h2>Configuración</h2>
      </div>

      <div className="config-cards-grid">
        <ConfigCard
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          }
          title="Categoría de empleados"
          description="Tipos de empleado y valor jornal"
          count={categorias.length}
          onClick={() => setModalCategoria(true)}
        />
        <ConfigCard
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          }
          title="Productos"
          description="Insumos y químicos del sistema"
          count={productos.length}
          onClick={() => setModalProducto(true)}
        />
        <ConfigCard
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          }
          title="Habilitaciones"
          description="Habilitaciones existentes"
          count={habilitaciones.length}
          onClick={() => setModalHabilitacion(true)}
        />
      </div>

      {modalCategoria && (
        <CatalogModal
          title="Categoría de Empleado"
          columns={categoriaColumns}
          fields={categoriaFields}
          items={categorias as unknown as Record<string, unknown>[]}
          loading={loadingCategorias}
          idField="idCategoria"
          displayField="nombre"
          onCreate={async (values) => {
            await createCategoria(values as never);
          }}
          onUpdate={async (id, values) => {
            await updateCategoria(id, values as never);
          }}
          onDelete={async (id) => {
            await deleteCategoria(id);
          }}
          onClose={() => setModalCategoria(false)}
          onRefresh={refetchCategorias}
        />
      )}

      {modalProducto && (
        <CatalogModal
          title="Producto"
          columns={productoColumns}
          fields={productoFields}
          items={productos as unknown as Record<string, unknown>[]}
          loading={loadingProductos}
          idField="idProducto"
          displayField="nombre"
          onCreate={async (values) => {
            await createProducto(values as never);
          }}
          onUpdate={async (id, values) => {
            await updateProducto(id, values as never);
          }}
          onDelete={async (id) => {
            await deleteProducto(id);
          }}
          onClose={() => setModalProducto(false)}
          onRefresh={refetchProductos}
        />
      )}

      {modalHabilitacion && (
        <CatalogModal
          title="Habilitacion de empleado"
          columns={habilitacionColumns}
          fields={habilitacionFields}
          items={habilitaciones as unknown as Record<string, unknown>[]}
          loading={loadingHabilitaciones}
          idField="idHabilitacion"
          displayField="nombre"
          onCreate={async (values) => {
            await createHabilitacion(values as never);
          }}
          onUpdate={async (id, values) => {
            await updateHabilitacion(id, values as never);
          }}
          onDelete={async (id) => {
            await deleteHabilitacion(id);
          }}
          onClose={() => setModalHabilitacion(false)}
          onRefresh={refetchHabilitaciones}
        />
      )}

      <section className="config-general-section">
        <h3 className="config-general-title">Configuración General</h3>
        <div className="config-general-card">
          <div className="config-general-item">
            <span className="config-general-label">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              Empresa
            </span>
            <span className="config-general-value">Forestal AG</span>
          </div>

          <div className="config-general-item">
            <span className="config-general-label">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Moneda por defecto
            </span>
            <span className="config-general-value">Peso Uruguayo (UYU)</span>
          </div>

          <div className="config-general-item">
            <span className="config-general-label">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Zona horaria
            </span>
            <span className="config-general-value">America/Montevideo (GMT-3)</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Configuracion;
