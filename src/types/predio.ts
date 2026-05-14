export interface Campo {
  idCampo: number;
  nombre: string;
  padron: string;
  superficieTotal: number;
  coordLat: number;
  coordLng: number;
}

export interface CampoDTO {
  nombre: string;
  padron: string;
  superficieTotal: number;
  coordLat: number;
  coordLng: number;
}

export interface Rodal {
  idRodal: number;
  campo: Campo;
  nombre: string;
  area: number;
  coordLat: number;
  coordLng: number;
}

export interface RodalDTO {
  nombre: string;
  area: number;
  coordLat: number;
  coordLng: number;
  idCampo: number;
}

export interface RodalResponse {
  nombre: string;
  area: number;
  coordLat: number;
  coordLng: number;
  nombreCampo: string;
}

export interface Parcela {
  idParcela: number;
  rodal: Rodal;
  nombre: string;
  area: number;
  tipoCultivo: string;
  anioPlantacion: number;
  coordLat: number;
  coordLng: number;
}

export interface ParcelaDTO {
  nombre: string;
  area: number;
  tipoCultivo: string;
  anioPlantacion: number;
  coordLat: number;
  coordLng: number;
  idRodal: number;
}

export interface ParcelaResponse {
  nombre: string;
  area: number;
  tipoCultivo: string;
  anioPlantacion: number;
  coordLat: number;
  coordLng: number;
  nombreRodal: string;
}
