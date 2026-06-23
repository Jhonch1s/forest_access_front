import AsignacionList from "../components/AsignacionList";
import Button from "../components/Button";
import { useState, useMemo } from "react";

import { useAsignaciones, useAsignacionesByParcelaPaginado } from "../hooks/useAsignaciones";

function Tareas() {


  const [selectedParcelaId, setSelectedParcelaId] = useState<number | null>(null);
  const [selectedCampoId, setSelectedCampoId] = useState<number | null>(null);
  const [expandedRodalId, setExpandedRodalId] = useState<number | null>(null);

  const toggleRodal = (rodalId: number) => {
    setExpandedRodalId(prev => (prev === rodalId ? null : rodalId));
  };
  const { asignacionesPaginadas, goToPage, refetch, loadingAsignaciones, error, currentPage, totalPages } = useAsignacionesByParcelaPaginado(selectedParcelaId, 5);
  const { asignaciones, loading } = useAsignaciones();

  const parcelas = new Map();
  asignaciones.forEach(asign => {
    let palabras = [asign.nombreCampo, ' / ', asign.nombreRodal, ' / ', asign.nombreParcela];
    let optionNombre = palabras.join(' ');
    parcelas.set(asign.idParcela, optionNombre);
  });

  const parcelasArray = Array.from(parcelas, ([id, nombre]) => ({ id, nombre }));

  const campos = new Map();

  asignaciones.forEach(asig => {
    campos.set(asig.idCampo, asig.nombreCampo);
  });

  const camposArray = Array.from(campos, ([id, nombre]) => ({ id, nombre }));

  const rodalesDisponibles = useMemo(() => {
    if (!selectedCampoId) return [];
    const rodalesMap = new Map<number, string>();
    asignaciones.forEach(asig => {
      if (asig.idCampo === selectedCampoId) {
        rodalesMap.set(asig.idRodal, asig.nombreRodal);
      }
    });
    return Array.from(rodalesMap, ([id, nombre]) => ({ id, nombre }));
  }, [asignaciones, selectedCampoId]);






  return (
    <>
      <div>
        <div className="page-header">
          <h2>Tratamientos</h2>
        </div>
        <p>Visualización de Tratamientos.</p>
      </div>
      <div className="asignar-panel">
        <div className="campo-selector">
          <label htmlFor="campo">Campo</label>
          <select id="campo"
            disabled={loading}
            value={selectedCampoId ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (value == "0") {
                setSelectedParcelaId(value ? Number(value) : null);
              }
              const id = value ? Number(value) : null;
              setSelectedCampoId(id);
            }}
          >
            <option value="0">{loading ? 'Cargando...' : '-- Seleccioná un campo --'}</option>
            {camposArray.map(campo => (
              <option key={campo.id} value={campo.id}>
                {campo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="arbol-container">
          {!selectedCampoId && (
            <p className="arbol-empty">Seleccioná un campo para ver rodales y parcelas.</p>
          )}


          {rodalesDisponibles.map(rodal => {
            const parcelasMap = new Map<number, { id: number; nombre: string; numero: number }>();

            asignaciones.forEach(asig => {
              if (asig.idRodal === rodal.id) {
                if (!parcelasMap.has(asig.idParcela)) {
                  const partes = asig.nombreParcela.split('-');
                  const numero = partes.length === 2 ? Number(partes[1]) : 0;
                  parcelasMap.set(asig.idParcela, {
                    id: asig.idParcela,
                    nombre: asig.nombreParcela,
                    numero: numero
                  });
                }
              }
            });

            const parcelasArray = Array.from(parcelasMap.values())
              .sort((a, b) => a.numero - b.numero);
            const isExpanded = expandedRodalId === rodal.id;

            return (
              <div key={rodal.id} style={{ marginBottom: '8px' }} className="rodal-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="rodal-header" onClick={() => toggleRodal(rodal.id)}>

                  <button className={`rodal-toggle ${isExpanded ? 'expanded' : ''}`}>
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <svg className="rodal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 19h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    <path d="M12 11v.01" />
                    <path d="M8 11v.01" />
                    <path d="M16 11v.01" />
                    <path d="M12 15v.01" />
                    <path d="M8 15v.01" />
                    <path d="M16 15v.01" />
                  </svg>
                  <label htmlFor="" className="custom-checkbox" >
                    <span className="rodal-nombre">{rodal.nombre}</span>
                  </label>
                </div>
                {isExpanded && (
                  <div style={{ paddingLeft: '20px' }} >
                    {parcelasArray.length === 0 ? (
                      <p>No hay parcelas en este rodal</p>
                    ) : (
                      <div className="parcelas-list">
                        {parcelasArray.map(parcela => (
                          <div onClick={() => { setSelectedParcelaId(prev => (prev === parcela.id ? null : parcela.id)); }}>
                            <label htmlFor="" className={`parcela-item ${selectedParcelaId == parcela.id ? 'parcela-selected' : ''}`} >
                              <input
                                type="radio"
                                name="parcelaSelection"
                                id={`parcela-${parcela.id}`}
                                value={parcela.id}
                                checked={selectedParcelaId === parcela.id}
                                readOnly
                              />
                              <svg className="parcela-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span className="parcela-nombre">{parcela.nombre}</span>
                            </label>



                          </div>

                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>











      {loadingAsignaciones && (
        <div className="categoria-status">
          <div className="categoria-spinner" />
          <p>Cargando asignaciones...</p>
        </div>
      )}

      {error && !loadingAsignaciones && (
        <div className="categoria-status">
          <p className="categoria-error">{error}</p>
          <Button variant="secondary" onClick={() => refetch()}>Reintentar</Button>
        </div>
      )}

      {!error && !loadingAsignaciones && (
        <AsignacionList asignaciones={asignacionesPaginadas}>

        </AsignacionList>
      )}


      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <Button variant='primary' size="medium" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Anterior</Button>
        <Button variant='primary' size="medium" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
      </div>
    </>

  );
}

export default Tareas;
