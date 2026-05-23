import api from "./api";
import type { EmpleadoHabilitacionDTO, EmpleadoHabilitacionResponse } from "../types/empleado-habilitacion";

export async function getEmpleadoHabilitaciones(): Promise<EmpleadoHabilitacionResponse[]>{
    const {data} = await api.get("empleado_habilitaciones/all");
    return data;
}

export async function createEmpleadoHabilitacion(empHab: EmpleadoHabilitacionDTO): Promise<EmpleadoHabilitacionResponse[]>{
    const {data} = await api.post("empleado_habilitaciones/create",empHab);
    return data;
}

export async function updateEmpleadoHabilitacion(idEmp: number,idHab:number,empHab: EmpleadoHabilitacionDTO): Promise<EmpleadoHabilitacionResponse[]>{
    const {data} = await api.put(`empleado_habilitaciones/update/${idEmp}/${idHab}`,empHab);
    return data;
}

export async function deleteEmpleadoHabilitacion(idEmp:number,idHab:number): Promise<void>{
    await api.delete(`empleado_habilitaciones/delete/${idEmp}/${idHab}`);
}

export async function obtenerHabilitacionesDeEmpleado(id:number): Promise<EmpleadoHabilitacionResponse[]>{
    const {data} = await api.get(`empleado_habilitaciones/empleado/${id}`);
    return data;
}

