export interface Perfil {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombreUsuario: string;
  password: string;
  perfiles: Perfil[];
}

export interface LoginRequest {
  usuario: string;
  password: string;
}
