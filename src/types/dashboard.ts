export interface CuadrillaResumenDTO {
    id: number;
    nombre: string;
    tratamientos: string[];
    fecha: string;
}

export interface HabilitacionResumenDTO {
    id: number;
    empleado: string;
    trabajo: string;
    fecha: string;
    estado: string;
}

export interface EstadisticasDTO {
    productividadSemanal: number[]; // Array de 5 para Lunes a Viernes
    evolucionHoras: number[]; // Array de 4 para últimas 4 semanas
    labelsSemanas: string[]; // Labels para el gráfico de líneas
    estadoTareas: Record<string, number>; // Objeto con claves "En proceso", "Pendiente", "Finalizada"
}

export interface DashboardDTO {
    cuadrillasActivas: CuadrillaResumenDTO[];
    habilitacionesPorVencer: HabilitacionResumenDTO[];
    estadisticas: EstadisticasDTO;
}
