export interface Perfil {
  id: number;
  nombre: string;
}

export interface UsuarioResponse {
  id: number;
  nombreUsuario: string;
  perfiles: Perfil[];
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface RegisterRequest {
  nombreUsuario: string;
  password: string;
}
