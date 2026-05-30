import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Campo, Rodal, Parcela } from '../types/predio';
import type { FieldConfig } from '../components/FormModal';
import { useCampos } from '../hooks/useCampos';
import { useRodalParcelas } from '../hooks/useRodalParcelas';
import { createCampo, updateCampo, deleteCampo } from '../services/campoService';
import { createRodal, updateRodal, deleteRodal } from '../services/rodalService';
import { createParcela, updateParcela, deleteParcela } from '../services/parcelaService';
import CampoHeader from '../components/CampoHeader';
import CampoSelector from '../components/CampoSelector';
import RodalCard from '../components/RodalCard';
import FormModal from '../components/FormModal';
import Button from '../components/Button';
import './Parcelas.css';

const CAMPO_STORAGE_KEY = 'parcelas_campo_actual';

const campoFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'padron', label: 'Padrón' },
  { name: 'superficieTotal', label: 'Superficie (ha)', type: 'number', required: true },
  { name: 'coordLat', label: 'Latitud', type: 'number', step: '0.00000001' },
  { name: 'coordLng', label: 'Longitud', type: 'number', step: '0.00000001' },
];

const rodalFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'area', label: 'Área (ha)', type: 'number', required: true },
  { name: 'coordLat', label: 'Latitud', type: 'number', step: '0.00000001' },
  { name: 'coordLng', label: 'Longitud', type: 'number', step: '0.00000001' },
];

const parcelaFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', required: true },
  { name: 'area', label: 'Área (ha)', type: 'number', required: true },
  { name: 'tipoCultivo', label: 'Tipo de Cultivo', required: true },
  { name: 'anioPlantacion', label: 'Año de Plantación', type: 'number' },
  { name: 'coordLat', label: 'Latitud', type: 'number', step: '0.00000001' },
  { name: 'coordLng', label: 'Longitud', type: 'number', step: '0.00000001' },
];

type ModalState =
  | { type: 'crearCampo' }
  | { type: 'editarCampo'; campo: Campo }
  | { type: 'selectorCampo' }
  | { type: 'crearRodal' }
  | { type: 'editarRodal'; rodal: Rodal }
  | { type: 'crearParcela'; idRodal: number }
  | { type: 'editarParcela'; parcela: Parcela; idRodal: number }
  | null;

function Parcelas() {
  const { campos, loading: loadingCampos, refetch: refetchCampos } = useCampos();
  const [campoActualId, setCampoActualId] = useState<number | null>(() => {
    const stored = localStorage.getItem(CAMPO_STORAGE_KEY);
    if (!stored) return null;
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : null;
  });
  const [rodalExpandido, setRodalExpandido] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [mapVersion, setMapVersion] = useState(0);
  const [parcelaSeleccionada, setParcelaSeleccionada] = useState<Parcela | null>(null);

  const campoActual = useMemo(() => {
    if (campoActualId !== null && Number.isFinite(campoActualId)) {
      const found = campos.find((c) => c.idCampo === campoActualId);
      if (found) return found;
    }
    return campos.length > 0 ? campos[0] : null;
  }, [campos, campoActualId]);

  const effectiveCampoId = campoActual?.idCampo ?? null;

  const { rodales, parcelasPorRodal, loading: loadingDatos, refetch: refetchDatos } = useRodalParcelas(effectiveCampoId);

  // Persist campo selection
  useEffect(() => {
    if (campoActual) {
      localStorage.setItem(CAMPO_STORAGE_KEY, String(campoActual.idCampo));
    }
  }, [campoActual]);

  const handleRefresh = useCallback(() => {
    refetchCampos();
    refetchDatos();
  }, [refetchCampos, refetchDatos]);

  // --- Campo CRUD ---
  const handleCrearCampo = async (values: Record<string, string | number>) => {
    await createCampo({
      nombre: values.nombre as string,
      padron: (values.padron as string) || '',
      superficieTotal: values.superficieTotal as number,
      coordLat: (values.coordLat as number) || 0,
      coordLng: (values.coordLng as number) || 0,
    });
    handleRefresh();
    setModal(null);
    // Select the new campo after refresh
    setTimeout(() => {
      const stored = localStorage.getItem(CAMPO_STORAGE_KEY);
      if (!stored) {
        // Will auto-select from useEffect
      }
    }, 100);
  };

  const handleEditarCampo = async (values: Record<string, string | number>) => {
    if (!campoActual) return;
    await updateCampo(campoActual.idCampo, {
      nombre: values.nombre as string,
      padron: (values.padron as string) || '',
      superficieTotal: values.superficieTotal as number,
      coordLat: (values.coordLat as number) || 0,
      coordLng: (values.coordLng as number) || 0,
    });
    handleRefresh();
    setMapVersion((v) => v + 1);
    setModal(null);
  };

  const handleEliminarCampo = async () => {
    if (!campoActual) return;
    if (!confirm(`¿Eliminar el campo "${campoActual.nombre}"? Esto también eliminará sus rodales y parcelas.`)) return;
    await deleteCampo(campoActual.idCampo);
    setCampoActualId(null);
    localStorage.removeItem(CAMPO_STORAGE_KEY);
    handleRefresh();
  };

  const handleSeleccionarCampo = (campo: Campo) => {
    setCampoActualId(campo.idCampo);
    setRodalExpandido(null);
    setParcelaSeleccionada(null);
    setModal(null);
  };

  // --- Rodal CRUD ---
  const handleCrearRodal = async (values: Record<string, string | number>) => {
    if (!campoActual) return;
    await createRodal({
      nombre: values.nombre as string,
      area: values.area as number,
      coordLat: (values.coordLat as number) || 0,
      coordLng: (values.coordLng as number) || 0,
      idCampo: campoActual.idCampo,
    });
    handleRefresh();
    setModal(null);
  };

  const handleEditarRodal = async (values: Record<string, string | number>) => {
    if (!campoActual || !modal || modal.type !== 'editarRodal') return;
    await updateRodal(modal.rodal.idRodal, {
      nombre: values.nombre as string,
      area: values.area as number,
      coordLat: (values.coordLat as number) || 0,
      coordLng: (values.coordLng as number) || 0,
      idCampo: campoActual.idCampo,
    });
    handleRefresh();
    setModal(null);
  };

  const handleEliminarRodal = async (rodal: Rodal) => {
    if (!confirm(`¿Eliminar el rodal "${rodal.nombre}"? Esto también eliminará sus parcelas.`)) return;
    await deleteRodal(rodal.idRodal);
    if (rodalExpandido === rodal.idRodal) setRodalExpandido(null);
    handleRefresh();
  };

  // --- Parcela CRUD ---
  const handleCrearParcela = async (values: Record<string, string | number>) => {
    if (!modal || modal.type !== 'crearParcela') return;
    await createParcela({
      nombre: values.nombre as string,
      area: values.area as number,
      tipoCultivo: values.tipoCultivo as string,
      anioPlantacion: (values.anioPlantacion as number) || 0,
      coordLat: (values.coordLat as number) || 0,
      coordLng: (values.coordLng as number) || 0,
      idRodal: modal.idRodal,
    });
    handleRefresh();
    setModal(null);
  };

  const handleEditarParcela = async (values: Record<string, string | number>) => {
    if (!modal || modal.type !== 'editarParcela') return;
    await updateParcela(modal.parcela.idParcela, {
      nombre: values.nombre as string,
      area: values.area as number,
      tipoCultivo: values.tipoCultivo as string,
      anioPlantacion: (values.anioPlantacion as number) || 0,
      coordLat: (values.coordLat as number) || 0,
      coordLng: (values.coordLng as number) || 0,
      idRodal: modal.idRodal,
    });
    handleRefresh();
    setModal(null);
  };

  const handleEliminarParcela = async (parcela: Parcela) => {
    if (!confirm(`¿Eliminar la parcela "${parcela.nombre}"?`)) return;
    await deleteParcela(parcela.idParcela);
    handleRefresh();
  };

  const handleBuscarParcela = (parcela: Parcela) => {
    if (parcela.coordLat !== 0 && parcela.coordLng !== 0) {
      setParcelaSeleccionada(parcela);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Esta parcela no tiene coordenadas definidas.');
    }
  };

  // --- Render ---
  const loading = loadingCampos || loadingDatos;

  return (
    <div className="parcelas-page">
      <CampoHeader
        key={`${campoActual?.idCampo ?? 'empty'}-${mapVersion}`}
        campo={campoActual}
        parcelaSeleccionada={parcelaSeleccionada}
        onEdit={() => campoActual && setModal({ type: 'editarCampo', campo: campoActual })}
        onDelete={handleEliminarCampo}
        onChangeCampo={() => setModal({ type: 'selectorCampo' })}
        onCrearCampo={() => setModal({ type: 'crearCampo' })}
      />

      <div className="page-header">
        <h2>Parcelas</h2>
        {campoActual && (
          <Button variant="primary" onClick={() => setModal({ type: 'crearRodal' })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 16, height: 16, marginRight: 6}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Nuevo Rodal
          </Button>
        )}
      </div>

      {loading && (
        <div className="parcelas-status">
          <div className="parcelas-spinner" />
          <p>Cargando datos...</p>
        </div>
      )}

      {!loading && campoActual && rodales.length === 0 && (
        <div className="parcelas-status">
          <p>No hay rodales en este campo.</p>
          <Button variant="primary" onClick={() => setModal({ type: 'crearRodal' })}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 16, height: 16, marginRight: 6}}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Crear Primer Rodal
          </Button>
        </div>
      )}

      {!loading && campoActual && rodales.length > 0 && (
        <div className="parcelas-rodales-list">
          {rodales.map((rodal) => (
            <RodalCard
              key={rodal.idRodal}
              rodal={rodal}
              parcelas={parcelasPorRodal.get(rodal.idRodal) ?? []}
              expandido={rodalExpandido === rodal.idRodal}
              onToggle={() =>
                setRodalExpandido(rodalExpandido === rodal.idRodal ? null : rodal.idRodal)
              }
              onEdit={() => setModal({ type: 'editarRodal', rodal })}
              onDelete={() => handleEliminarRodal(rodal)}
              onAddParcela={() => setModal({ type: 'crearParcela', idRodal: rodal.idRodal })}
              onEditParcela={(p) =>
                setModal({ type: 'editarParcela', parcela: p, idRodal: rodal.idRodal })
              }
              onDeleteParcela={handleEliminarParcela}
              onBuscarParcela={handleBuscarParcela}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'crearCampo' && (
        <FormModal
          title="Nuevo Campo"
          fields={campoFields}
          onSubmit={handleCrearCampo}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'editarCampo' && (
        <FormModal
          title="Editar Campo"
          fields={campoFields}
          initialValues={modal.campo as unknown as Record<string, unknown>}
          onSubmit={handleEditarCampo}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'selectorCampo' && (
        <CampoSelector
          campos={campos}
          campoActualId={campoActualId}
          onSelect={handleSeleccionarCampo}
          onCrearNuevo={() => setModal({ type: 'crearCampo' })}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'crearRodal' && (
        <FormModal
          title="Nuevo Rodal"
          fields={rodalFields}
          onSubmit={handleCrearRodal}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'editarRodal' && (
        <FormModal
          title="Editar Rodal"
          fields={rodalFields}
          initialValues={modal.rodal as unknown as Record<string, unknown>}
          onSubmit={handleEditarRodal}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'crearParcela' && (
        <FormModal
          title="Nueva Parcela"
          fields={parcelaFields}
          onSubmit={handleCrearParcela}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === 'editarParcela' && (
        <FormModal
          title="Editar Parcela"
          fields={parcelaFields}
          initialValues={modal.parcela as unknown as Record<string, unknown>}
          onSubmit={handleEditarParcela}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default Parcelas;
