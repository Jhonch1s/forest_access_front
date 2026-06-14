import AsignacionList from "../components/AsignacionList";
import Button from "../components/Button";
import { useState } from "react";

import { useAsignaciones, useAsignacionesByParcelaPaginado } from "../hooks/useAsignaciones";

function Tareas() {


   const [selectedParcelaId, setSelectedParcelaId] = useState<number | null>(null);
  const { asignacionesPaginadas, goToPage, refetch, loading, error, currentPage, totalPages } = useAsignacionesByParcelaPaginado(selectedParcelaId, 5);
  const { asignaciones } = useAsignaciones();

  const parcelas = new Map();
  asignaciones.forEach(asign => {
    parcelas.set(asign.idParcela, asign.nombreParcela);
  });


  const parcelasArray = Array.from(parcelas, ([id, nombre]) => ({ id, nombre }));




  return (
    <>
      <div>
        <div className="page-header">
          <h2>Tareas</h2>
        </div>
        <p>Gestión de tareas y catálogo de tareas.</p>
      </div>
      <select
      value={selectedParcelaId ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedParcelaId(value ? Number(value) : null);
        }}
      >
        <option value={0}>-- Selecciona una parcela --</option>
        {parcelasArray.map(parcela => (
          <option key={parcela.id} value={parcela.id}>
            {parcela.nombre }
          </option>
        ))}
      </select>

      {loading && (
        <div className="categoria-status">
          <div className="categoria-spinner" />
          <p>Cargando asignaciones...</p>
        </div>
      )}

      {error && !loading && (
        <div className="categoria-status">
          <p className="categoria-error">{error}</p>
          <Button variant="secondary" onClick={() => refetch()}>Reintentar</Button>
        </div>
      )}

      {!error && !loading && (
        <AsignacionList asignaciones={asignacionesPaginadas}>

        </AsignacionList>
      )}

      
      <div>
        <Button variant='primary' size="medium" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</Button>
        <Button variant='primary' size="medium" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
      </div>
    </>

  );
}

export default Tareas;
