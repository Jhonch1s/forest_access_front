import api from './api';
import type {  HabilitacionDTO } from '../types/habilitacion';


export async function getHabilitaciones(): Promise<HabilitacionDTO[]>{
    const { data } = await api.get('/habilitaciones/all');
    return data;
}

export async function createHabilitacion(habilitacion: HabilitacionDTO): Promise<HabilitacionDTO[]>{
    const { data } = await api.post('/habilitaciones/create',habilitacion);
    return data;
}

export async function updateHabilitacion(id: number, habilitacion: HabilitacionDTO): Promise<HabilitacionDTO[]>{
    const { data } = await api.put(`/habilitaciones/update/${id}`,habilitacion);
    return data;
}

export async function deleteHabilitacion(id:number): Promise<void>{
    await api.delete(`/habilitaciones/delete/${id}`);
}