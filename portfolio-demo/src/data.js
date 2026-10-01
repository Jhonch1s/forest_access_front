export const fields = [
  { id: 1, name: 'Predio Las Acacias', code: 'FA-01', area: 184, rodales: [
    { id: 11, name: 'Rodal Norte', area: 62, parcels: [
      { id: 111, name: 'Parcela N-01', area: 24, crop: 'Eucalipto', year: 2021 },
      { id: 112, name: 'Parcela N-02', area: 20, crop: 'Eucalipto', year: 2020 },
      { id: 113, name: 'Parcela N-03', area: 18, crop: 'Pino', year: 2019 },
    ] },
    { id: 12, name: 'Rodal Sur', area: 48, parcels: [
      { id: 121, name: 'Parcela S-01', area: 28, crop: 'Pino', year: 2022 },
      { id: 122, name: 'Parcela S-02', area: 20, crop: 'Eucalipto', year: 2021 },
    ] },
  ] },
  { id: 2, name: 'Predio El Ceibo', code: 'FA-02', area: 96, rodales: [
    { id: 21, name: 'Rodal Este', area: 55, parcels: [
      { id: 211, name: 'Parcela E-01', area: 30, crop: 'Eucalipto', year: 2020 },
      { id: 212, name: 'Parcela E-02', area: 25, crop: 'Pino', year: 2022 },
    ] },
  ] },
]

export const crews = [
  { id: 1, name: 'Cuadrilla Alba', foreman: 'Mara Vidal', members: ['Mara Vidal', 'Diego Solís', 'Eva Rojas', 'Leo Brito'], active: true },
  { id: 2, name: 'Cuadrilla Ceibo', foreman: 'Andrés Paredes', members: ['Andrés Paredes', 'Nina Cabrera', 'Tomás Rey'], active: true },
  { id: 3, name: 'Cuadrilla Arroyo', foreman: 'Julia Montes', members: ['Julia Montes', 'Bruno Salas'], active: false },
]

export const employees = [
  { id: 1, name: 'Mara Vidal', role: 'Puntero', crewId: 1, permits: ['Manejo de maquinaria', 'Trabajo en altura'] },
  { id: 2, name: 'Diego Solís', role: 'Peón', crewId: 1, permits: ['Manejo de maquinaria'] },
  { id: 3, name: 'Eva Rojas', role: 'Peón', crewId: 1, permits: ['Trabajo en altura'] },
  { id: 4, name: 'Leo Brito', role: 'Peón', crewId: 1, permits: [] },
  { id: 5, name: 'Andrés Paredes', role: 'Puntero', crewId: 2, permits: ['Aplicación de productos'] },
  { id: 6, name: 'Nina Cabrera', role: 'Peón', crewId: 2, permits: ['Manejo de maquinaria'] },
  { id: 7, name: 'Tomás Rey', role: 'Peón', crewId: 2, permits: [] },
]

export const permits = [
  { id: 1, employee: 'Diego Solís', name: 'Manejo de maquinaria', state: 'Por vencer', when: 'En 4 días' },
  { id: 2, employee: 'Eva Rojas', name: 'Trabajo en altura', state: 'Vencida', when: 'Hace 2 días' },
  { id: 3, employee: 'Andrés Paredes', name: 'Aplicación de productos', state: 'Por vencer', when: 'En 6 días' },
]

export const treatments = ['Control de malezas', 'Poda', 'Raleo']

export const initialAssignments = [
  { id: 1, parcelId: 111, treatment: 'Control de malezas', crewId: 1, status: 'En ejecución', due: 'En 5 días' },
  { id: 2, parcelId: 112, treatment: 'Poda', crewId: 1, status: 'Planificado', due: 'En 9 días' },
  { id: 3, parcelId: 211, treatment: 'Raleo', crewId: 2, status: 'En ejecución', due: 'En 7 días' },
]

export const initialTasks = [
  { id: 1, assignmentId: 1, employee: 'Diego Solís', type: 'Control de malezas', hours: 4, status: 'En proceso' },
  { id: 2, assignmentId: 1, employee: 'Eva Rojas', type: 'Inspección', hours: 2, status: 'Finalizada' },
  { id: 3, assignmentId: 3, employee: 'Nina Cabrera', type: 'Raleo', hours: 3, status: 'En proceso' },
]

export function locateParcel(parcelId) {
  for (const field of fields) for (const rodal of field.rodales) {
    const parcel = rodal.parcels.find((item) => item.id === parcelId)
    if (parcel) return { field, rodal, parcel }
  }
  return null
}
