import api from './api';
import type { DashboardDTO } from '../types/dashboard';

export async function getDashboardData(): Promise<DashboardDTO> {
    const { data } = await api.get('/dashboard');
    return data;
}
