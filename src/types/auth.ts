export interface Perfil {
  id: number;
  nombre: string;
}

export interface PerfilDTO {
  id: number;
  nombre: string;
}

export interface PerfilResponse {
  id: number;
  nombre: string;
}

export interface UsuarioDTO {
  nombreUsuario: string;
  password: string;
}

export interface UsuarioResponse {
  id: number;
  nombreUsuario: string;
  perfiles: PerfilResponse[];
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface RegisterRequest {
  nombreUsuario: string;
  password: string;
}

export interface AuthUser {
  nombreUsuario: string;
  perfiles: string[];
  idEmpleado?: number;
}