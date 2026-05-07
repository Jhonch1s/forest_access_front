export interface Campo {
  idCampo: number;
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
