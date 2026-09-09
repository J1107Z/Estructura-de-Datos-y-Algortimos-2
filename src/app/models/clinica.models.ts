export interface Paciente {
  id: number;
  nombre: string;
  motivo: string;
}

export interface Atencion {
  id: number;
  paciente: string;
  motivo: string;
  medico: string;
  especialidad: string;
}

export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
}

export interface MiembroComite {
  id: number;
  nombre: string;
  cargo: string;
}
