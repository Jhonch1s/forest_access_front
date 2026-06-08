import api from './api';
import type { ReporteEmpleadoDTO, ReporteBatchPage } from '../types/reporte';

export interface ReporteBatchParams {
  inicio: string;
  hasta: string;
  page?: number;
  size?: number;
}

export type ReporteBatchResponse = ReporteEmpleadoDTO[] | ReporteBatchPage;

export function esPageResponse(r: ReporteBatchResponse): r is ReporteBatchPage {
  return r !== null && typeof r === 'object' && 'content' in r;
}

export async function getReporteBatch(params: ReporteBatchParams): Promise<ReporteBatchResponse> {
  const { data } = await api.get('/tareas/reporte-batch', { params });
  return data;
}
